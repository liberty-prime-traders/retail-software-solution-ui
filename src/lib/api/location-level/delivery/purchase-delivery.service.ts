import {Injectable} from '@angular/core'
import {BaseService} from '../../util/base-api/base.service'
import {Purchase} from '../purchase/purchase.model'
import {PurchaseDelivery} from './purchase-delivery.model'
import {PurchaseDeliveryStore} from './purchase-delivery.store'

@Injectable({providedIn: 'root'})
export class PurchaseDeliveryService extends BaseService<Purchase, Partial<PurchaseDelivery>> {

  constructor(protected override readonly store: PurchaseDeliveryStore) {
    super(store)
  }
}
