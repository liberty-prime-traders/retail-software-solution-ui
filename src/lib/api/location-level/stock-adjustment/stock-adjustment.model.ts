import {BaseModel} from '../../util/base-api/base.model'
import {StockAdjustmentCategory} from './stock-adjustment-category.enum'
import {StockAdjustmentDirection} from './stock-adjustment-direction.enum'

export interface StockAdjustment extends BaseModel {
  locationProductId: string
  productLabel?: string
  category: StockAdjustmentCategory
  direction: StockAdjustmentDirection
  quantity: number
  unitId: string
  unitCost?: number
  totalCost?: number
  stockMovementReasonId?: string
  note?: string
  adjustedBy?: string
  adjustedAt?: string
}
