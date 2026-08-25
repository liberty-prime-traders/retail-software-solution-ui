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
    this.patchApiRequestConfig({urlSuffix: 'draft'})
    return this.post(body as any, this.withSummarySync(callbacks))
  }

  dispatch(orderRef: EntityId, callbacks?: ApiCallbacks<StockTransferResponse>): Subscription {
    this.patchApiRequestConfig({urlSuffix: 'dispatch'})
    return this.postRequest({callbacks: this.withSummarySync(callbacks), id: orderRef})
  }

  cancelTransfer(orderRef: EntityId, callbacks?: ApiCallbacks<StockTransferResponse>): Subscription {
    this.patchApiRequestConfig({urlSuffix: 'cancel'})
    return this.postRequest({callbacks: this.withSummarySync(callbacks), id: orderRef})
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
    this.patchApiRequestConfig({urlSuffix: 'lines'})
    return this.postRequest({body: body as any, callbacks: this.withSummarySync(callbacks), id: orderRef})
  }

  removeLine(orderRef: EntityId, lineRef: string, callbacks?: ApiCallbacks<StockTransferResponse>): Subscription {
    this.patchApiRequestConfig({urlSuffix: `lines/remove/${lineRef}`})
    return this.postRequest({callbacks: this.withSummarySync(callbacks), id: orderRef})
  }

  confirmLine(orderRef: EntityId, lineRef: string, callbacks?: ApiCallbacks<StockTransferResponse>): Subscription {
    this.patchApiRequestConfig({urlSuffix: `lines/confirm/${lineRef}`})
    return this.postRequest({callbacks: this.withSummarySync(callbacks), id: orderRef})
  }

  undoLineConfirmation(
    orderRef: EntityId,
    lineRef: string,
    callbacks?: ApiCallbacks<StockTransferResponse>
  ): Subscription | undefined {
    this.patchApiRequestConfig({urlSuffix: `lines/unconfirm/${lineRef}`})
    return this.deleteRequest({callbacks: this.withSummarySync(callbacks), id: orderRef})
  }

  completeTransfer(receiptRef: EntityId, callbacks?: ApiCallbacks<StockTransferResponse>): Subscription {
    this.patchApiRequestConfig({urlSuffix: `complete`})
    return this.postRequest({callbacks: this.withSummarySync(callbacks), id: receiptRef})
  }

}
