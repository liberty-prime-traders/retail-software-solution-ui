import {PaginatedModel} from '../../util/paginated-api/paginated.model'
import {Purchase} from './purchase.model'

export interface PurchaseSearchResult extends Purchase, PaginatedModel {
}
