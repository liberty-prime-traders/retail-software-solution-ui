import {Injectable} from '@angular/core'
import {createPaginatedBaseStore, PaginatedBaseStore} from '../../util/paginated-api/paginated-base.store'
import {ExpenseSearchParameters} from './expense-search-parameters.model'
import {ExpenseSearchResult} from './expense-search-result.model'

@Injectable({providedIn: 'root'})
export class ExpenseSearchResultStore
  extends createPaginatedBaseStore<ExpenseSearchResult, ExpenseSearchParameters>()
  implements PaginatedBaseStore<ExpenseSearchResult, ExpenseSearchParameters> {

  readonly basePath = 'expenses'
}
