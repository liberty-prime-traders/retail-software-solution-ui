import {PaginatedModel} from '../../util/paginated-api/paginated.model'

// The API sends no id; the summary store keys each row on locationProductId.
export interface ProductSalesSummary extends PaginatedModel {
  locationProductId: string
  orgProductId: string
  productName: string
  productGroupName: string
  baseUnitName: string
  lineCount: number
  baseQuantity: number
  baseQuantityText: string
  grossSales: number
  discountTotal: number
  surchargeTotal: number
  netSales: number
  cogs: number
  grossProfit: number
  marginPercent: number | null
  marginBeforeAdjustmentsPercent: number | null
  adjustmentsPercent: number | null
  avgListPrice: number | null
  avgSellingPrice: number | null
  avgCost: number | null
  profitPerBaseUnit: number | null
  /** 1-based needs-attention position across the searched range, whatever the sort; null outside the search. */
  rank: number | null
}
