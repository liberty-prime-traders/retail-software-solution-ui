import {Injectable} from '@angular/core'
import {createPaginatedBaseStore, PaginatedBaseStore} from '../../util/paginated-api/paginated-base.store'
import {FundMovementSearchParameters} from './fund-movement-search-parameters.model'
import {FundMovementSearchResult} from './fund-movement-search-result.model'

@Injectable({providedIn: 'root'})
export class FundMovementSearchResultStore
  extends createPaginatedBaseStore<FundMovementSearchResult, FundMovementSearchParameters>()
  implements PaginatedBaseStore<FundMovementSearchResult, FundMovementSearchParameters> {

  readonly basePath = 'fund-movements'
}
