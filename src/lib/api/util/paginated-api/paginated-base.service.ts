import {HttpErrorResponse} from '@angular/common/http'
import {signal, Signal} from '@angular/core'
import {isEqual} from 'lodash-es'
import {catchError, finalize, first, Subscription, tap} from 'rxjs'
import {ProcessingStatus} from '../../../utils/types/processing-status.enum'
import {BaseService} from '../base-api/base.service'
import {CURSOR, PageRequest} from './page-request.model'
import {PageResponse} from './page-response.model'
import {PaginatedBaseStore} from './paginated-base.store'
import {PaginatedModel} from './paginated.model'

export abstract class PaginatedBaseService<RESPONSE extends PaginatedModel, PARAMETERS>
  extends BaseService<RESPONSE, PageRequest<PARAMETERS>> {

  protected abstract readonly defaultCursor: CURSOR
  protected readonly BATCH_SIZE: number = 100
  protected readonly urlSuffix: string = 'search'

  readonly requireClientSideFilter: Signal<boolean>
  private readonly paginatedEntities = signal<RESPONSE[]>(this.getPlaceholders(15))
  private readonly freshLoadCount = signal(0)
  private isFreshLoad = false

  override readonly selectAll = this.paginatedEntities.asReadonly()
  readonly freshLoadCompleted = this.freshLoadCount.asReadonly()

  protected constructor(protected override readonly store: PaginatedBaseStore<RESPONSE, PARAMETERS>) {
    super(store)
    this.requireClientSideFilter = this.store.requireClientSideFilter
  }

  getPaginatedCount(): number {
    return this.paginatedEntities().filter(entity => !entity.placeholder).length
  }

  parametersHaveChanged(newParams: PARAMETERS): boolean {
    const lastParams = this.store.lastSearchParams()
    if (!lastParams) {
      return true
    }
    return !isEqual(lastParams, newParams)
  }

  override resetStoreAndClearCache() {
    super.resetStoreAndClearCache()
    this.paginatedEntities.set([])
    this.store.resetPagination()
  }

  override refetch(parameters: PARAMETERS): Subscription | undefined {
    const parametersHaveChanged = this.parametersHaveChanged(parameters)
    if (!parametersHaveChanged) {
      return undefined
    }
    this.resetStoreAndClearCache()
    this.isFreshLoad = true
    return this.executeSearch(parameters, this.defaultCursor)
  }

  loadNext(): Subscription | undefined {
    const lastSearchParams = this.store.lastSearchParams()
    if (!lastSearchParams || !this.store.hasMore()) {
      return undefined
    }
    return this.executeSearch(lastSearchParams, this.store.currentCursor())
  }

  private getPlaceholders(length: number): RESPONSE[] {
    return Array.from(
      {length},
      (_, index) => {
        return {
          id: `placeholder-${this.selectCount() + index + 1}`,
          placeholder: true
        } as RESPONSE
      }
    )
  }

  private executeSearch(parameters: PARAMETERS, previousCursor: CURSOR): Subscription {
    this.startApiRequest()
    const pageRequest: PageRequest<PARAMETERS> = {
      previousCursor,
      requestedSize: this.BATCH_SIZE,
      parameters
    }
    this.patchApiRequestConfig({urlSuffix: this.urlSuffix})
    return this.httpClient.post<PageResponse<RESPONSE>>(this.getBasePath(), pageRequest).pipe(
      first(),
      tap((response: PageResponse<RESPONSE>) => this.finishSavingPageWithSuccess(response, parameters)),
      catchError((error: HttpErrorResponse) => this.setStoreError(error)),
      finalize(() => this.finalizeApiRequest())
    ).subscribe()
  }

  finishSavingPageWithSuccess(response: PageResponse<RESPONSE>, parameters: PARAMETERS): void {
    this.patchPaginatedEntities(response)
    this.store.setPaginationState({
      currentCursor: response.currentCursor,
      hasMore: response.hasMore,
      requireClientSideFilter: response.requireClientSideFilter,
      lastSearchParams: parameters
    })
    this.setProcessingStatus(ProcessingStatus.SUCCESS)
    if (this.isFreshLoad) {
      this.isFreshLoad = false
      this.freshLoadCount.update(count => count + 1)
    }
  }

  private patchPaginatedEntities(response: PageResponse<RESPONSE>) {
    this.paginatedEntities.update(entities => {
      const loadedEntities = entities.filter(entity => !entity.placeholder)
      const updatedEntities = [...loadedEntities, ...response.contents]
      if (response.hasMore) {
        return [...updatedEntities, ...this.getPlaceholders(5)]
      }
      return updatedEntities
    })
  }

  pushToPaginatedEntities(newEntities: RESPONSE[]) {
    this.paginatedEntities.update(entities => {
      const entitiesMap = new Map(entities.map(entity => [entity.id, entity]))
      newEntities.forEach(newEntity => entitiesMap.set(newEntity.id, newEntity))
      return Array.from(entitiesMap.values())
    })
  }
}
