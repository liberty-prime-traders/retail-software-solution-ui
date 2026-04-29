import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {StockHistory} from './stock-history.model'

@Injectable({providedIn: 'root'})
export class StockHistoryStore extends createBaseStore<StockHistory>()
  implements BaseStore<StockHistory> {
  readonly basePath = 'location-products/history'
}
