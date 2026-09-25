import {ProductDetail} from '../../cross-tier/product/product-detail.model'

export interface LocationProduct extends ProductDetail {
  baseUnitId: string
  defaultSalePrice?: number
  lastPurchasePrice?: number
  minStockLevel?: number
  lastSyncedAt?: number
  stockBalance?: number
  openingStockQuantity?: number
}
