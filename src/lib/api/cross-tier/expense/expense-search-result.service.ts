import {Injectable} from '@angular/core'
import {PaginatedBaseService} from '../../util/paginated-api/paginated-base.service'
import {ExpenseSearchParameters} from './expense-search-parameters.model'
import {ExpenseSearchResult} from './expense-search-result.model'
import {ExpenseSearchResultStore} from './expense-search-result.store'

@Injectable({providedIn: 'root'})
export class ExpenseSearchResultService extends PaginatedBaseService<ExpenseSearchResult, ExpenseSearchParameters> {
  protected override readonly defaultCursor = ''

  constructor(protected override readonly store: ExpenseSearchResultStore) {
    super(store)
  }
}
