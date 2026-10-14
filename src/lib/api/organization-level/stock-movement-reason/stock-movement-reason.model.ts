import {BaseModel} from '../../util/base-api/base.model'
import {MovementType} from './movement-type.enum'

export interface StockMovementReason extends BaseModel {
  code?: string
  name: string
  description?: string
  movementTypes: MovementType[]
  systemDefined: boolean
  createdBy?: string
  createdOn?: number
}
