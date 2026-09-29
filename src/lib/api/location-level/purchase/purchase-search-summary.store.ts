import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {PurchaseSearchSummary} from './purchase-search-summary.model'

@Injectable({providedIn: 'root'})
export class PurchaseSearchSummaryStore extends createBaseStore<PurchaseSearchSummary>()
  implements BaseStore<PurchaseSearchSummary> {

  readonly basePath = 'purchases/summary'
}
