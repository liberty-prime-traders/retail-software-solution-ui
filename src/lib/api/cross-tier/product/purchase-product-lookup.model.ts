import {PaginatedModel} from '../../util/paginated-api/paginated.model'
import {ProductCore} from './product-core.model'

export interface PurchaseProductLookup extends ProductCore, PaginatedModel {
  lastPurchasePrice?: number
}
