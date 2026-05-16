import {PaginatedModel} from '../../util/paginated-api/paginated.model'
import {ProductCore} from './product-core.model'

export interface SaleProductLookup extends ProductCore, PaginatedModel {
  defaultSalePrice?: number
  stockBatches?: StockBatchPreviewDto[]
}

export interface StockBatchPreviewDto {
  id: string
  externalReferenceNumber?: string
  priority?: number
  availableBaseQty: number
  unitCost?: number
}
