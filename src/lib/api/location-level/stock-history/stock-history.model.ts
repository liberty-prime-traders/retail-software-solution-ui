import {BaseModel} from '../../util/base-api/base.model'
import {MovementType} from './movement-type.enum'

export interface StockHistory extends BaseModel{
  locationProductId: string
  movementType: MovementType
  documentReference?: string
  detailReference?: string
  quantityMoved: string
  newQuantity: string
  recordedOn: string
  conversionDriftNote?: string
}
