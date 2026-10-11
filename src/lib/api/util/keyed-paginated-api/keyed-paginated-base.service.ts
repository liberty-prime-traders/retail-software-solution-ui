import {HttpErrorResponse} from '@angular/common/http'
import {computed, signal, Signal} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {isEqual} from 'lodash-es'
import {EMPTY, finalize, first, Subscription} from 'rxjs'
import {catchError, tap} from 'rxjs/operators'
import {Multimap} from '../../../utils/types/multimap.type'
import {BaseService} from '../base-api/base.service'
import {BaseStore} from '../base-api/base.store'
import {CURSOR, PageRequest} from '../paginated-api/page-request.model'
import {PageResponse} from '../paginated-api/page-response.model'
import {PaginatedModel} from '../paginated-api/paginated.model'
import {KeyedPageState} from './keyed-page-state.model'

/**
 * Paginated search where every key (e.g. a contact) owns its own pages, cursor and loading state.
 * Leaving a key and coming back reuses what was fetched; only scrolling past the end fires a page request,
 * continuing from the cursor stored for that key.
 */
export abstract class KeyedPaginatedBaseService<RESPONSE extends PaginatedModel, PARAMETERS>
  extends BaseService<RESPONSE, PageRequest<PARAMETERS>> {

  protected abstract readonly defaultCursor: CURSOR
  protected abstract readonly urlSuffix: string

  protected readonly BATCH_SIZE: number = 100
  protected readonly INITIAL_PLACEHOLDERS: number = 15
  protected readonly NEXT_PAGE_PLACEHOLDERS: number = 5

  private readonly pages = signal(new Map<string, KeyedPageState<PARAMETERS>>())
  private readonly requestCounter = signal(0)
  private readonly entries = new Multimap<RESPONSE>(undefined, false, (entity) => this.store.selectId(entity))

  protected constructor(protected override readonly store: BaseStore<RESPONSE>) {
    super(store)
  }

  selectForKey(key: Signal<EntityId | undefined>): Signal<RESPONSE[]> {
    return computed(() => {
      const keyValue = key()
      if (!keyValue) {
        return []
      }
      const loaded = this.entries.get(String(keyValue))
      const state = this.pages().get(String(keyValue))
      const placeholderCount = this.placeholderCount(loaded.length, state)
      if (!placeholderCount) {
        return loaded
      }
      return [...loaded, ...this.getPlaceholders(String(keyValue), loaded.length, placeholderCount)]
    })
  }

  selectLoadingForKey(key: Signal<EntityId | undefined>): Signal<boolean> {
    return computed(() => !!key() && !!this.pages().get(String(key()))?.loading)
  }

  selectHasMoreForKey(key: Signal<EntityId | undefined>): Signal<boolean> {
    return computed(() => !!key() && !!this.pages().get(String(key()))?.hasMore)
  }

  getLoadedCount(key: EntityId): number {
    return this.entries.get(String(key)).length
  }

  ensureLoaded(key: EntityId | undefined, parameters: PARAMETERS): Subscription | undefined {
    if (!key) {
      return undefined
    }
    const state = this.pages().get(String(key))
    if (state && isEqual(state.parameters, parameters)) {
      return undefined
    }
    return this.reload(key, parameters)
  }

  reload(key: EntityId, parameters: PARAMETERS): Subscription {
    this.evict(key)
    return this.executeSearch(String(key), parameters, this.defaultCursor)
  }

  loadNext(key: EntityId | undefined): Subscription | undefined {
    if (!key) {
      return undefined
    }
    const state = this.pages().get(String(key))
    if (!state || !state.hasMore || state.loading) {
      return undefined
    }
    return this.executeSearch(String(key), state.parameters, state.currentCursor)
  }

  evict(key: EntityId): void {
    this.entries.delete(String(key))
    this.pages.update(pages => {
      const updated = new Map(pages)
      updated.delete(String(key))
      return updated
    })
  }

  invalidateAll(): void {
    this.entries.clear()
    this.pages.set(new Map())
  }

  private executeSearch(key: string, parameters: PARAMETERS, previousCursor: CURSOR): Subscription {
    const requestId = this.requestCounter() + 1
    this.requestCounter.set(requestId)
    this.patchPageState(key, parameters, {loading: true, requestId})
    this.store.clearError()
    const pageRequest: PageRequest<PARAMETERS> = {previousCursor, requestedSize: this.BATCH_SIZE, parameters}
    const url = `${this.getBasePath(key)}/${this.urlSuffix}`
    return this.httpClient.post<PageResponse<RESPONSE>>(url, pageRequest).pipe(
      first(),
      tap((response: PageResponse<RESPONSE>) => this.finishSavingPage(key, requestId, response)),
      catchError((error: HttpErrorResponse) => {
        this.discardFailedFirstPage(key, requestId, previousCursor)
        this.store.setError(error)
        return EMPTY
      }),
      finalize(() => this.finishRequest(key, requestId))
    ).subscribe()
  }

  private finishSavingPage(key: string, requestId: number, response: PageResponse<RESPONSE>): void {
    if (this.pages().get(key)?.requestId !== requestId) {
      return
    }
    this.entries.patch(key, response.contents)
    this.patchPageState(key, undefined, {
      currentCursor: response.currentCursor,
      hasMore: response.hasMore,
      requireClientSideFilter: response.requireClientSideFilter
    })
  }

  private discardFailedFirstPage(key: string, requestId: number, previousCursor: CURSOR): void {
    const isFirstPage = previousCursor === this.defaultCursor
    if (isFirstPage && this.pages().get(key)?.requestId === requestId) {
      this.evict(key)
    }
  }

  private finishRequest(key: string, requestId: number): void {
    if (this.pages().get(key)?.requestId === requestId) {
      this.patchPageState(key, undefined, {loading: false})
    }
  }

  private patchPageState(
    key: string,
    parameters: PARAMETERS | undefined,
    patch: Partial<KeyedPageState<PARAMETERS>>
  ): void {
    this.pages.update(pages => {
      const current = pages.get(key) ?? this.createInitialState(parameters as PARAMETERS)
      const updated = new Map(pages)
      updated.set(key, {...current, ...patch})
      return updated
    })
  }

  private createInitialState(parameters: PARAMETERS): KeyedPageState<PARAMETERS> {
    return {
      currentCursor: this.defaultCursor,
      hasMore: false,
      requireClientSideFilter: false,
      loading: false,
      parameters,
      requestId: 0
    }
  }

  private placeholderCount(loadedCount: number, state?: KeyedPageState<PARAMETERS>): number {
    if (!state?.loading && !state?.hasMore) {
      return 0
    }
    return loadedCount === 0 ? this.INITIAL_PLACEHOLDERS : this.NEXT_PAGE_PLACEHOLDERS
  }

  private getPlaceholders(key: string, offset: number, length: number): RESPONSE[] {
    return Array.from(
      {length},
      (_, index) => ({id: `placeholder-${key}-${offset + index + 1}`, placeholder: true} as unknown as RESPONSE)
    )
  }
}
