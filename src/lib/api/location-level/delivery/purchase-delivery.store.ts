import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {Purchase} from '../purchase/purchase.model'

@Injectable({providedIn: 'root'})
export class PurchaseDeliveryStore extends createBaseStore<Purchase>()
  implements BaseStore<Purchase> {
  readonly basePath = 'deliveries'
}
