import {BaseModel} from '../../util/base-api/base.model'
import {StockAdjustmentCategory} from './stock-adjustment-category.enum'
import {StockAdjustmentDirection} from './stock-adjustment-direction.enum'

export interface StockAdjustmentReasonOption {
  id: string
  name: string
  allowedDirections: StockAdjustmentDirection[]
}

export interface StockAdjustmentCategoryDescriptor extends BaseModel {
  category: StockAdjustmentCategory
  displayName: string
  allowedDirections: StockAdjustmentDirection[]
  requiresUnitCost: boolean
  requiresReason: boolean
  requiresNote: boolean
  reasons: StockAdjustmentReasonOption[]
}
