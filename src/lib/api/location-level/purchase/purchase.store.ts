import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {Purchase} from './purchase.model'

@Injectable({providedIn: 'root'})
export class PurchaseStore extends createBaseStore<Purchase>()
  implements BaseStore<Purchase> {
  readonly basePath = 'purchases'
}
