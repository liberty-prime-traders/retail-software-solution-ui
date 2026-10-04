import {computed, inject, Injectable, signal} from '@angular/core'
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

interface SessionSideEffects {
  // The session might affect data a confirmed sale's grid/summary shows - bump the count so
  // SalesFilterState knows to force a reload. Cheap to set liberally: the rules for what's editable
  // post-confirm live server-side and can change, so there's no reliable way to rule a call out here.
  bumpSaleMutatedCount?: boolean
  // The session is resolved (saved or confirmed) and should no longer show in "my unsaved carts".
  removeFromUnsavedCarts?: boolean
  // A new session was started that the "my unsaved carts" list doesn't know about yet.
  refetchUnsavedCarts?: boolean
}

@Injectable({providedIn: 'root'})
export class SaleSessionService extends BaseService<SaleSession> {

  private readonly unsavedCartsSummaryService = inject(UnsavedCartsSummaryService)
  readonly currentSession = computed(() => this.selectFirst()!)
  private readonly currentSessionId = computed(() => this.currentSession()?.id)

  // Consumed by SalesFilterState to know when to force a reload
  private readonly saleMutatedCount = signal(0)
  readonly saleMutated = this.saleMutatedCount.asReadonly()

  constructor(protected override readonly store: SaleSessionStore) {
    super(store)
  }

  override prepareResponse(response: SaleSession) {
    return [response]
  }

  startNewSession(newSessionRequest: SaleSessionStartRequest, callbacks?: ApiCallbacks<SaleSession>) {
    this.resetStoreAndClearCache()
    return this.postRequest({
      body: newSessionRequest,
      callbacks: this.getSessionCallback({refetchUnsavedCarts: true}, callbacks)
    })
  }

  acquireSession(sessionId: string, callbacks?: ApiCallbacks<SaleSession>) {
    return this.refetchRequest({id: sessionId, callbacks})
  }

  updateSaleLines(lineRequest: SaleSessionLineRequest, callbacks?: ApiCallbacks<SaleSession>) {
    this.patchApiRequestConfig({urlSuffix: 'lines'})
    return this.putRequest({
      id: this.currentSessionId(),
      body: lineRequest as any,
      callbacks: this.getSessionCallback({bumpSaleMutatedCount: true}, callbacks)
    })
  }

  removeSaleLine(identity: SessionIdentity, callbacks?: ApiCallbacks<SaleSession>) {
    this.patchApiRequestConfig({urlSuffix: 'lines'})
    return this.deleteRequest({
      id: this.currentSessionId(),
      body: {identity} as any,
      callbacks: this.getSessionCallback({bumpSaleMutatedCount: true}, callbacks)
    })
  }

  addPayment(paymentAddRequest: SaleSessionPaymentAddRequest, callbacks?: ApiCallbacks<SaleSession>) {
    this.patchApiRequestConfig({urlSuffix: 'payments'})
    return this.postRequest({
      id: this.currentSessionId(),
      body: paymentAddRequest as any,
      callbacks: this.getSessionCallback({bumpSaleMutatedCount: true}, callbacks)
    })
  }

  removePayment(request: SaleSessionPaymentRemoveRequest, callbacks?: ApiCallbacks<SaleSession>) {
    this.patchApiRequestConfig({urlSuffix: 'payments'})
    return this.deleteRequest({
      id: this.currentSessionId(),
      body: request as any,
      callbacks: this.getSessionCallback({bumpSaleMutatedCount: true}, callbacks)
    })
  }

  updateHeader(headerUpdateRequest: SaleSessionHeaderUpdateRequest, callbacks?: ApiCallbacks<SaleSession>) {
    this.patchApiRequestConfig({urlSuffix: 'header'})
    return this.putRequest({
      id: this.currentSessionId(),
      body: headerUpdateRequest as any,
      callbacks: this.getSessionCallback({bumpSaleMutatedCount: true}, callbacks)
    })
  }

  saveAsDraft(callbacks?: ApiCallbacks<SaleSession>) {
    this.patchApiRequestConfig({urlSuffix: 'draft'})
    return this.postRequest({
      id: this.currentSessionId(),
      callbacks: this.getSessionCallback({removeFromUnsavedCarts: true}, callbacks)
    })
  }

  confirmSession(callbacks?: ApiCallbacks<SaleSession>) {
    this.patchApiRequestConfig({urlSuffix: 'confirm'})
    return this.postRequest({
      id: this.currentSessionId(),
      callbacks: this.getSessionCallback({removeFromUnsavedCarts: true, bumpSaleMutatedCount: true}, callbacks)
    })
  }

  discardOrVoidSale(reason: string, callbacks?: ApiCallbacks<SaleSession>) {
    this.patchApiRequestConfig({urlSuffix: 'void'})
    return this.postRequest({
      id: this.currentSessionId(),
      body: {reason} as any,
      callbacks: this.getSessionCallback({bumpSaleMutatedCount: true}, callbacks)
    })
  }

  override finishDeletingWithSuccess() {
    this.setProcessingStatus(ProcessingStatus.SUCCESS)
  }

  private readonly getSessionCallback = (sideEffects: SessionSideEffects, callbacks?: ApiCallbacks<SaleSession>) =>
    this.applyInternalCallBacks({
      onSuccess: (result: SaleSession) => {
        if (sideEffects.bumpSaleMutatedCount) {
          this.saleMutatedCount.update(count => count + 1)
        }
        if (sideEffects.removeFromUnsavedCarts) {
          this.unsavedCartsSummaryService.removeEntities([result.id])
        }
        if (sideEffects.refetchUnsavedCarts) {
          this.unsavedCartsSummaryService.refetch()
        }
      }
    }, callbacks)
}
