import {HttpErrorResponse} from '@angular/common/http'
import {catchError, finalize, first, Subscription, tap} from 'rxjs'
import {ProcessingStatus} from '../../../utils/types/processing-status.enum'
import {BaseModel} from '../base-api/base.model'
import {BaseService} from '../base-api/base.service'
import {PageRequest} from './page-request.model'
import {PageResponse} from './page-response.model'
import {PaginatedBaseStore} from './paginated-base.store'

export abstract class PaginatedBaseService<RESPONSE extends BaseModel, PARAMETERS>
  extends BaseService<RESPONSE, PageRequest<PARAMETERS>> {

  protected static readonly BATCH_SIZE = 60

  protected constructor(protected override readonly store: PaginatedBaseStore<RESPONSE, PARAMETERS>) {
    super(store)
  }

  abstract parametersHaveChanged(newParams: PARAMETERS): boolean

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
    return this.executeSearch(parameters, 0)
  }

  loadNext(): Subscription | undefined {
    const lastSearchParams = this.store.lastSearchParams()
    if (!lastSearchParams || !this.store.hasMore()) {
      return undefined
    }
    return this.executeSearch(lastSearchParams, this.store.currentCursor())
  }

  private executeSearch(parameters: PARAMETERS, previousCursor: number): Subscription {
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
      lastSearchParams: parameters
    })
    this.setProcessingStatus(ProcessingStatus.SUCCESS)
  }

}
