import {PaginatedModel} from '../../util/paginated-api/paginated.model'
import {FundMovement} from './fund-movement.model'

export interface FundMovementSearchResult extends FundMovement, PaginatedModel {
}
