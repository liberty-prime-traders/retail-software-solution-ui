import {computed, inject, Injectable} from '@angular/core'
import {ProcessingStatus} from '../../../utils/types/processing-status.enum'
import {ApiCallbacks} from '../../util/base-api/api-callbacks'
import {BaseService} from '../../util/base-api/base.service'
import {UnsavedCartsSummaryService} from '../unsaved-carts-summary/unsaved-carts-summary.service'
import {
  SaleSessionHeaderUpdateRequest,
  SaleSessionLineRequest,
  SaleSessionPaymentAddRequest,
  SaleSessionPaymentRemoveRequest,
  SaleSessionStartRequest
} from './sale-session-requests.model'
import {SaleSession, SessionIdentity} from './sale-session.model'
import {SaleSessionStore} from './sale-session.store'


@Injectable({providedIn: 'root'})
export class SaleSessionService extends BaseService<SaleSession> {

  private readonly unsavedCartsSummaryService = inject(UnsavedCartsSummaryService)
  readonly currentSession = computed(() => this.selectFirst()!)
  private readonly currentSessionId = computed(() => this.currentSession()?.id)

  constructor(protected override readonly store: SaleSessionStore) {
    super(store)
  }

  override prepareResponse(response: SaleSession) {
    return [response]
  }

  startNewSession(newSessionRequest: SaleSessionStartRequest, callbacks?: ApiCallbacks<SaleSession>) {
    this.resetStoreAndClearCache()
    return this.postRequest({body: newSessionRequest, callbacks: this.getCallBackForNewSession(callbacks)})
  }

  private readonly getCallBackForNewSession = (callbacks?: ApiCallbacks<SaleSession>) =>
    this.applyInternalCallBacks({onSuccess: () => this.unsavedCartsSummaryService.refetch()}, callbacks)


  acquireSession(sessionId: string, callbacks?: ApiCallbacks<SaleSession>) {
    return this.refetchRequest({id: sessionId, callbacks})
  }

  updateSaleLines(lineRequest: SaleSessionLineRequest, callbacks?: ApiCallbacks<SaleSession>) {
    this.patchApiRequestConfig({urlSuffix: 'lines'})
    return this.putRequest({id: this.currentSessionId(), body: lineRequest as any, callbacks})
  }

  removeSaleLine(identity: SessionIdentity, callbacks?: ApiCallbacks<SaleSession>) {
    this.patchApiRequestConfig({urlSuffix: 'lines'})
    return this.deleteRequest({id: this.currentSessionId(), body: {identity} as any, callbacks})
  }

  addPayment(paymentAddRequest: SaleSessionPaymentAddRequest, callbacks?: ApiCallbacks<SaleSession>) {
    this.patchApiRequestConfig({urlSuffix: 'payments'})
    return this.postRequest({id: this.currentSessionId(), body: paymentAddRequest as any, callbacks})
  }

  removePayment(request: SaleSessionPaymentRemoveRequest, callbacks?: ApiCallbacks<SaleSession>) {
    this.patchApiRequestConfig({urlSuffix: 'payments'})
    return this.deleteRequest({id: this.currentSessionId(), body: request as any, callbacks})
  }

  updateHeader(headerUpdateRequest: SaleSessionHeaderUpdateRequest, callbacks?: ApiCallbacks<SaleSession>) {
    this.patchApiRequestConfig({urlSuffix: 'header'})
    return this.putRequest({id: this.currentSessionId(), body: headerUpdateRequest as any, callbacks})
  }

  saveAsDraft(callbacks?: ApiCallbacks<SaleSession>) {
    this.patchApiRequestConfig({urlSuffix: 'draft'})
    return this.postRequest({
      id: this.currentSessionId(),
      callbacks: this.getCallBackForPersistedSession(callbacks)
    })
  }

  private readonly getCallBackForPersistedSession = (callbacks?: ApiCallbacks<SaleSession>) =>
    this.applyInternalCallBacks(
      {onSuccess: (result: SaleSession) => this.unsavedCartsSummaryService.removeEntities([result.id])},
      callbacks
    )

  confirmSession(callbacks?: ApiCallbacks<SaleSession>) {
    this.patchApiRequestConfig({urlSuffix: 'confirm'})
    return this.postRequest({
      id: this.currentSessionId(),
      callbacks: this.getCallBackForPersistedSession(callbacks)
    })
  }

  override finishDeletingWithSuccess() {
    this.setProcessingStatus(ProcessingStatus.SUCCESS)
  }
}
