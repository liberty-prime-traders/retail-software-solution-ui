import {ProductCore} from '../../cross-tier/product/product-core.model'
import {PaginatedModel} from '../../util/paginated-api/paginated.model'

export interface ProductQuantities {
  quantityOnHand: number
  quantityReserved: number
  quantityAvailable: number
}

export interface ProductWithAvailability extends ProductCore, PaginatedModel, ProductQuantities {
}
