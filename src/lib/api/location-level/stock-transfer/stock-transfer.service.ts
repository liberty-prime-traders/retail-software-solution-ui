import {inject, Injectable} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {Subscription} from 'rxjs'
import {StockTransferSummaryService} from '../../cross-tier/stock-transfer/stock-transfer-summary.service'
import {ApiCallbacks} from '../../util/base-api/api-callbacks'
import {BaseService} from '../../util/base-api/base.service'
import {StockTransferCreateRequest, StockTransferLineRequest} from './stock-transfer-requests.model'
import {StockTransferResponse} from './stock-transfer-response.model'
import {StockTransferStore} from './stock-transfer.store'

@Injectable({providedIn: 'root'})
export class StockTransferService extends BaseService<StockTransferResponse> {

  private readonly stockTransferSummaryService = inject(StockTransferSummaryService)

  constructor(protected override readonly store: StockTransferStore) {
    super(store)
  }

  createTransfer(body: StockTransferCreateRequest, callbacks?: ApiCallbacks<StockTransferResponse>): Subscription {
    return this.postRequest({
      body: body as any,
      callbacks: this.withSummarySync(callbacks),
      config: {urlSuffix: 'draft'}
    })
  }

  dispatch(orderRef: EntityId, callbacks?: ApiCallbacks<StockTransferResponse>): Subscription {
    return this.postRequest({callbacks: this.withSummarySync(callbacks), id: orderRef, config: {urlSuffix: 'dispatch'}})
  }

  cancelTransfer(orderRef: EntityId, callbacks?: ApiCallbacks<StockTransferResponse>): Subscription {
    return this.postRequest({callbacks: this.withSummarySync(callbacks), id: orderRef, config: {urlSuffix: 'cancel'}})
  }

  loadTransfer(orderRef: EntityId, callbacks?: ApiCallbacks<StockTransferResponse>): Subscription | undefined {
    return this.refetchRequest({id: orderRef, callbacks})
  }

  private readonly withSummarySync = (callbacks?: ApiCallbacks<StockTransferResponse>) =>
    this.applyInternalCallBacks(
      {
        onSuccess: (response: StockTransferResponse) =>
          this.stockTransferSummaryService.applyResponse(response.summary)
      },
      callbacks
    )

  applyLineChanges(
    orderRef: EntityId,
    body: StockTransferLineRequest,
    callbacks?: ApiCallbacks<StockTransferResponse>
  ): Subscription {
    return this.postRequest({
      body: body as any,
      callbacks: this.withSummarySync(callbacks),
      id: orderRef,
      config: {urlSuffix: 'lines'}
    })
  }

  removeLine(orderRef: EntityId, lineRef: string, callbacks?: ApiCallbacks<StockTransferResponse>): Subscription {
    return this.postRequest({
      callbacks: this.withSummarySync(callbacks),
      id: orderRef,
      config: {urlSuffix: `lines/remove/${lineRef}`}
    })
  }

  confirmLine(orderRef: EntityId, lineRef: string, callbacks?: ApiCallbacks<StockTransferResponse>): Subscription {
    return this.postRequest({
      callbacks: this.withSummarySync(callbacks),
      id: orderRef,
      config: {urlSuffix: `lines/confirm/${lineRef}`}
    })
  }

  undoLineConfirmation(
    orderRef: EntityId,
    lineRef: string,
    callbacks?: ApiCallbacks<StockTransferResponse>
  ): Subscription | undefined {
    return this.deleteRequest({
      callbacks: this.withSummarySync(callbacks),
      id: orderRef,
      config: {urlSuffix: `lines/unconfirm/${lineRef}`}
    })
  }

  completeTransfer(receiptRef: EntityId, callbacks?: ApiCallbacks<StockTransferResponse>): Subscription {
    return this.postRequest({
      callbacks: this.withSummarySync(callbacks),
      id: receiptRef,
      config: {urlSuffix: `complete`}
    })
  }

}
