import {Injectable} from '@angular/core'
import {createPaginatedBaseStore, PaginatedBaseStore} from '../../util/paginated-api/paginated-base.store'
import {PurchaseSearchParameters} from './purchase-search-parameters.model'
import {PurchaseSearchResult} from './purchase-search-result.model'

@Injectable({providedIn: 'root'})
export class PurchaseSearchResultStore
  extends createPaginatedBaseStore<PurchaseSearchResult, PurchaseSearchParameters>()
  implements PaginatedBaseStore<PurchaseSearchResult, PurchaseSearchParameters> {

  readonly basePath = 'purchases'
}
