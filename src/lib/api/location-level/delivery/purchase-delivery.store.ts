import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {PurchaseDelivery} from './purchase-delivery.model'

@Injectable({providedIn: 'root'})
export class PurchaseDeliveryStore extends createBaseStore<PurchaseDelivery>()
  implements BaseStore<PurchaseDelivery> {
  readonly basePath = 'deliveries'
}
