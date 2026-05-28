import {ProductCore} from '../../cross-tier/product/product-core.model'
import {PaginatedModel} from '../../util/paginated-api/paginated.model'

export interface ProductForSale extends ProductCore, PaginatedModel, ProductQuantities {
  defaultSalePrice: number
}

export interface ProductQuantities {
  quantityOnHand: number
  quantityReserved: number
  quantityAvailable: number
}
