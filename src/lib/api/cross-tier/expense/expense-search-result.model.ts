import {PaginatedModel} from '../../util/paginated-api/paginated.model'
import {Expense} from './expense.model'

export interface ExpenseSearchResult extends Expense, PaginatedModel {
}
