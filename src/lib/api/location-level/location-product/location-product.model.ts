import {BaseProduct} from '../../cross-tier/product/base-product.model'

export interface LocationProduct extends BaseProduct {
  productId?: string
  categoryId?: string
  defaultSalePrice?: number
  minStockLevel?: number
  lastSyncedAt?: number
}
