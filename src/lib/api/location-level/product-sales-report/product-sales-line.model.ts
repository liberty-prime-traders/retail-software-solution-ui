import {PaginatedModel} from '../../util/paginated-api/paginated.model'
import {AdjustmentDirection} from '../sale_session/sale-session.model'

export interface ProductSalesLineAdjustment {
  reasonName: string
  direction: AdjustmentDirection
  /** Signed: discounts are negative. */
  amount: number
}

export interface ProductSalesLine extends PaginatedModel {
  saleReferenceNumber: string
  dateSold: string
  quantityEntered: string
  baseQuantity: number
  grossSales: number
  netSales: number
  cogs: number
  grossProfit: number
  marginPercent: number | null
  adjustments: ProductSalesLineAdjustment[]
}
