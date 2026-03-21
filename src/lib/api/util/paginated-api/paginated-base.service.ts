import {HttpErrorResponse} from '@angular/common/http'
import {computed, signal, Signal} from '@angular/core'
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
  protected static readonly BATCH_SIZE = 100
  private readonly paginatedEntitiesVersion = signal(0)

  readonly requireClientSideFilter: Signal<boolean>
  private readonly paginatedEntities: Array<RESPONSE> = this.getPlaceholders(15)

  override readonly selectAll = computed(() => {
    this.paginatedEntitiesVersion()
    return this.paginatedEntities
  })

  protected constructor(protected override readonly store: PaginatedBaseStore<RESPONSE, PARAMETERS>) {
    super(store)
    this.requireClientSideFilter = this.store.requireClientSideFilter
  }

  getPaginatedCount(): number {
    return this.paginatedEntities.filter(entity => !entity.placeholder).length
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
    this.paginatedEntities.splice(0)
    this.store.resetPagination()
  }

  override refetch(parameters: PARAMETERS): Subscription | undefined {
    const parametersHaveChanged = this.parametersHaveChanged(parameters)
    if (!parametersHaveChanged) {
      return undefined
    }
    this.resetStoreAndClearCache()
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
      requestedSize: PaginatedBaseService.BATCH_SIZE,
      parameters
    }
    this.patchApiRequestConfig({urlSuffix: 'search'})
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
  }

  private patchPaginatedEntities(response: PageResponse<RESPONSE>) {
    const entities = this.paginatedEntities
    let cutIndex = entities.length
    while (cutIndex > 0 && entities[cutIndex - 1].placeholder) {
      cutIndex--
    }
    if (cutIndex < entities.length) {
      entities.splice(cutIndex)
    }
    if (response.contents.length > 0) {
      entities.push(...response.contents)
    }
    if (response.hasMore) {
      entities.push(...this.getPlaceholders(5))
    }
    this.paginatedEntitiesVersion.update(v => v + 1)
  }

  pushToPaginatedEntities(newEntities: RESPONSE[]) {
    const entities = this.paginatedEntities
    const entitiesMap = new Map(entities.map(entity => [entity.id, entity]))
    newEntities.forEach(newEntity => entitiesMap.set(newEntity.id, newEntity))
    const updatedEntities = Array.from(entitiesMap.values())
    entities.splice(0, entities.length, ...updatedEntities)
    this.paginatedEntitiesVersion.update(v => v + 1)
  }
}
