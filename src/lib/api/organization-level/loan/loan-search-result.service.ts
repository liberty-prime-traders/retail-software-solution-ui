import {Injectable} from '@angular/core'
import {PaginatedBaseService} from '../../util/paginated-api/paginated-base.service'
import {LoanSearchParameters} from './loan-search-parameters.model'
import {LoanSearchResult} from './loan-search-result.model'
import {LoanSearchResultStore} from './loan-search-result.store'

@Injectable({providedIn: 'root'})
export class LoanSearchResultService extends PaginatedBaseService<LoanSearchResult, LoanSearchParameters> {
  protected override readonly defaultCursor = ''

  constructor(protected override readonly store: LoanSearchResultStore) {
    super(store)
  }
}
