import {PaginatedModel} from '../../util/paginated-api/paginated.model'
import {ProductCore} from '../../cross-tier/product/product-core.model'

export interface ProductForPurchase extends ProductCore, PaginatedModel {
  baseUnitId: string
  lastPurchasePrice?: number
}
