import {Injectable} from '@angular/core'
import {Subscription} from 'rxjs'
import {ApiCallbacks} from '../../util/base-api/api-callbacks'
import {BaseService} from '../../util/base-api/base.service'
import {
  PurchaseBulkPaymentCreateRequest,
  PurchaseBulkPaymentLine,
  PurchaseBulkPaymentSearchRequest
} from './purchase-bulk-payment.model'
import {PurchaseBulkPaymentStore} from './purchase-bulk-payment.store'

@Injectable({providedIn: 'root'})
export class PurchaseBulkPaymentService
  extends BaseService<PurchaseBulkPaymentLine, PurchaseBulkPaymentSearchRequest | PurchaseBulkPaymentCreateRequest> {

  static readonly MAXIMUM_LOADED_PURCHASES = 50

  constructor(protected override readonly store: PurchaseBulkPaymentStore) {
    super(store)
  }

  loadPayable(
    purchaseBulkPaymentSearchRequest: PurchaseBulkPaymentSearchRequest,
    callbacks?: ApiCallbacks<PurchaseBulkPaymentLine>
  ): Subscription {
    this.resetStoreAndClearCache()
    return this.postRequest({
      body: purchaseBulkPaymentSearchRequest,
      callbacks,
      config: {urlSuffix: 'bulk-payment/search'}
    })
  }

  recordPayment(
    purchaseBulkPaymentCreateRequest: PurchaseBulkPaymentCreateRequest,
    callbacks?: ApiCallbacks<PurchaseBulkPaymentLine>
  ): Subscription {
    return this.postRequest({
      body: purchaseBulkPaymentCreateRequest,
      callbacks,
      config: {urlSuffix: 'bulk-payment', upsertOnSuccess: true}
    })
  }

}
