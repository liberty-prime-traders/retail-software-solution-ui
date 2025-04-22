import {EntityId} from '@ngrx/signals/entities'
import {BaseModel} from '../base-api/base.model'

export interface UnitValue extends BaseModel{
  name?: string
  code?: string
  description?: string
  unitGroupId?: EntityId
  baseUnit?: string
  baseUnitName?: string
  conversionFactor?: number
}
