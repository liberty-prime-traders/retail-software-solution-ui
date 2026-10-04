import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {SaleSearchSummary} from './sale-search-summary.model'

@Injectable({providedIn: 'root'})
export class SaleSearchSummaryStore extends createBaseStore<SaleSearchSummary>()
  implements BaseStore<SaleSearchSummary> {

  readonly basePath = 'sales/search/summary'
}
