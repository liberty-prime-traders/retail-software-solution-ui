import {PaginatedModel} from '../../util/paginated-api/paginated.model'

// The API sends no id; the report store keys each row on locationProductId.
export interface ProductPurchasesReportRow extends PaginatedModel {
  locationProductId: string
  referenceNumber: string
  productName: string
  productGroupName: string
  categoryName: string
  deliveryLineCount: number
  receivedQuantityBreakdown: string
  totalCost: number
  averageCostPerBaseUnit: string | null
}
