import {PaginatedModel} from '../../util/paginated-api/paginated.model'
import {Loan} from './loan.model'

export interface LoanSearchResult extends Loan, PaginatedModel {
}
