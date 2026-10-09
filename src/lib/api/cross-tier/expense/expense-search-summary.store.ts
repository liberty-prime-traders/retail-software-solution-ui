import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {ExpenseSearchSummary} from './expense-search-summary.model'

@Injectable({providedIn: 'root'})
export class ExpenseSearchSummaryStore extends createBaseStore<ExpenseSearchSummary>()
  implements BaseStore<ExpenseSearchSummary> {

  readonly basePath = 'expenses/search/summary'
}
