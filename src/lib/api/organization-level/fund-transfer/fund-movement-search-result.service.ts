import {Injectable} from '@angular/core'
import {PaginatedBaseService} from '../../util/paginated-api/paginated-base.service'
import {FundMovementSearchParameters} from './fund-movement-search-parameters.model'
import {FundMovementSearchResult} from './fund-movement-search-result.model'
import {FundMovementSearchResultStore} from './fund-movement-search-result.store'

@Injectable({providedIn: 'root'})
export class FundMovementSearchResultService
  extends PaginatedBaseService<FundMovementSearchResult, FundMovementSearchParameters> {
  protected override readonly defaultCursor = ''

  constructor(protected override readonly store: FundMovementSearchResultStore) {
    super(store)
  }
}
