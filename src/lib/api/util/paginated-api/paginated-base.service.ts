import {HttpErrorResponse} from '@angular/common/http'
import {Signal} from '@angular/core'
import {isEqual} from 'lodash-es'
import {catchError, finalize, first, Subscription, tap} from 'rxjs'
import {ProcessingStatus} from '../../../utils/types/processing-status.enum'
import {BaseModel} from '../base-api/base.model'
import {BaseService} from '../base-api/base.service'
import {CURSOR, PageRequest} from './page-request.model'
import {PageResponse} from './page-response.model'
import {PaginatedBaseStore} from './paginated-base.store'

export abstract class PaginatedBaseService<RESPONSE extends BaseModel, PARAMETERS>
  extends BaseService<RESPONSE, PageRequest<PARAMETERS>> {

  protected abstract readonly defaultCursor: CURSOR
  readonly requireClientSideFilter: Signal<boolean>
  protected static readonly BATCH_SIZE = 60

  protected constructor(protected override readonly store: PaginatedBaseStore<RESPONSE, PARAMETERS>) {
    super(store)
    this.requireClientSideFilter = this.store.requireClientSideFilter
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

  private executeSearch(parameters: PARAMETERS, previousCursor: CURSOR): Subscription {
    this.startApiRequest()
    const pageRequest: PageRequest<PARAMETERS> = {
      previousCursor,
      requestedSize: PaginatedBaseService.BATCH_SIZE,
      parameters
    }
    return this.httpClient.post<PageResponse<RESPONSE>>(this.getBasePath(), pageRequest).pipe(
      first(),
      tap((response: PageResponse<RESPONSE>) => this.finishSavingPageWithSuccess(response, parameters)),
      catchError((error: HttpErrorResponse) => this.setStoreError(error)),
      finalize(() => this.finalizeApiRequest())
    ).subscribe()
  }

  finishSavingPageWithSuccess(response: PageResponse<RESPONSE>, parameters: PARAMETERS): void {
    this.store.upsertMany(response.contents)
    this.store.setPaginationState({
      currentCursor: response.currentCursor,
      hasMore: response.hasMore,
      requireClientSideFilter: response.requireClientSideFilter,
      lastSearchParams: parameters
    })
    this.setProcessingStatus(ProcessingStatus.SUCCESS)
  }

}
