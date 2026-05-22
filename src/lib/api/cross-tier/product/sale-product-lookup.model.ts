import {PaginatedModel} from '../../util/paginated-api/paginated.model'
import {ProductCore} from './product-core.model'

export interface SaleProductLookup extends ProductCore, PaginatedModel {
  defaultSalePrice: number
  stockBatches: StockBatch[]
}

export interface StockBatch {
  id: string
  externalReferenceNumber: string
  order: number
  availableBaseQty: number
  unitCost?: number
}
