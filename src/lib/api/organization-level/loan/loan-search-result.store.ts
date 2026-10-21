import {Injectable} from '@angular/core'
import {createPaginatedBaseStore, PaginatedBaseStore} from '../../util/paginated-api/paginated-base.store'
import {LoanSearchParameters} from './loan-search-parameters.model'
import {LoanSearchResult} from './loan-search-result.model'

@Injectable({providedIn: 'root'})
export class LoanSearchResultStore
  extends createPaginatedBaseStore<LoanSearchResult, LoanSearchParameters>()
  implements PaginatedBaseStore<LoanSearchResult, LoanSearchParameters> {

  readonly basePath = 'loans'
}
