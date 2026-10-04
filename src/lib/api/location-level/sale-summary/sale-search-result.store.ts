import {Injectable} from '@angular/core'
import {createPaginatedBaseStore, PaginatedBaseStore} from '../../util/paginated-api/paginated-base.store'
import {SaleSearchParameters} from './sale-search-parameters.model'
import {SaleSearchResult} from './sale-search-result.model'

@Injectable({providedIn: 'root'})
export class SaleSearchResultStore
  extends createPaginatedBaseStore<SaleSearchResult, SaleSearchParameters>()
  implements PaginatedBaseStore<SaleSearchResult, SaleSearchParameters> {

  readonly basePath = 'sales'
}
