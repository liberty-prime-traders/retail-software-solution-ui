import {Injectable} from '@angular/core'
import {Subscription} from 'rxjs'
import {ApiCallbacks} from '../../util/base-api/api-callbacks'
import {BaseService} from '../../util/base-api/base.service'
import {PurchaseDeliveryStore} from '../delivery/purchase-delivery.store'
import {Purchase} from '../purchase/purchase.model'
import {DeliveryLineRevisionRequest} from './delivery-line-revision-request.model'

@Injectable({providedIn: 'root'})
export class DeliveryLineRevisionService extends BaseService<Purchase, DeliveryLineRevisionRequest> {

  constructor(protected override readonly store: PurchaseDeliveryStore) {
    super(store)
  }

  revise(
    deliveryLineRevisionRequest: DeliveryLineRevisionRequest,
    callbacks?: ApiCallbacks<Purchase>
  ): Subscription {
    return this.postRequest({
      body: deliveryLineRevisionRequest,
      callbacks,
      config: {urlSuffix: 'line-revisions'}
    })
  }
}
