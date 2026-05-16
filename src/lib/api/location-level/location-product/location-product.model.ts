import {ProductDetail} from '../../cross-tier/product/product-detail.model'

export interface LocationProduct extends ProductDetail {
  defaultSalePrice?: number
  lastPurchasePrice?: number
  minStockLevel?: number
  lastSyncedAt?: number
  stockBalance?: number
}
