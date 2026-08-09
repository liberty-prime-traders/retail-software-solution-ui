import {inject, Injectable} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {Subscription} from 'rxjs'
import {StockTransferSummaryService} from '../../cross-tier/stock-transfer/stock-transfer-summary.service'
import {ApiCallbacks} from '../../util/base-api/api-callbacks'
import {BaseService} from '../../util/base-api/base.service'
import {StockTransferCreateDto} from './stock-transfer-create.dto'
import {StockTransferLineInsertDto} from './stock-transfer-line-insert.dto'
import {StockTransferLineUpdateDto} from './stock-transfer-line-update.dto'
import {StockTransferResponse} from './stock-transfer-response.model'
import {StockTransferStore} from './stock-transfer.store'

@Injectable({providedIn: 'root'})
export class StockTransferService extends BaseService<StockTransferResponse> {

  private readonly stockTransferSummaryService = inject(StockTransferSummaryService)

  constructor(protected override readonly store: StockTransferStore) {
    super(store)
  }

  createTransfer(body: StockTransferCreateDto, callbacks?: ApiCallbacks<StockTransferResponse>): Subscription {
    this.patchApiRequestConfig({urlSuffix: 'draft'})
    return this.post(body as any, this.withSummarySync(callbacks))
  }

  dispatch(orderRef: EntityId, callbacks?: ApiCallbacks<StockTransferResponse>): Subscription {
    this.patchApiRequestConfig({urlSuffix: 'dispatch'})
    return this.postRequest({callbacks: this.withSummarySync(callbacks), id: orderRef})
  }

  cancelTransfer(orderRef: EntityId, callbacks?: ApiCallbacks<StockTransferResponse>): Subscription {
    this.patchApiRequestConfig({urlSuffix: 'cancel'})
    return this.putRequest({callbacks: this.withSummarySync(callbacks), id: orderRef})
  }

  loadTransfer(orderRef: EntityId, callbacks?: ApiCallbacks<StockTransferResponse>): Subscription | undefined {
    return this.refetchRequest({id: orderRef, callbacks})
  }

  private readonly withSummarySync = (callbacks?: ApiCallbacks<StockTransferResponse>) =>
    this.applyInternalCallBacks(
      {onSuccess: (response: StockTransferResponse) => this.stockTransferSummaryService.applyResponse(response.summary)},
      callbacks
    )

  addLine(
    orderRef: string,
    body: StockTransferLineInsertDto,
    callbacks?: ApiCallbacks<StockTransferResponse>
  ): Subscription {
    this.patchApiRequestConfig({urlSuffix: 'lines'})
    return this.postRequest({body: body as any, callbacks, id: orderRef})
  }

  updateLine(
    orderRef: string,
    lineRef: string,
    body: StockTransferLineUpdateDto,
    callbacks?: ApiCallbacks<StockTransferResponse>
  ): Subscription {
    this.patchApiRequestConfig({urlSuffix: `lines/${lineRef}`})
    return this.putRequest({body: body as any, callbacks, id: orderRef})
  }

  removeLine(orderRef: string, lineRef: string, callbacks?: ApiCallbacks<StockTransferResponse>): Subscription {
    this.patchApiRequestConfig({urlSuffix: `${orderRef}/lines/remove/${lineRef}`})
    return this.putRequest({callbacks, id: orderRef})
  }
}
