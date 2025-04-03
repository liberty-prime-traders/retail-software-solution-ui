import {BaseModel} from '../base-api/base.model'

export interface UnitValue extends BaseModel{
  name?: string
  code?: string
  description?: string
  unitGroupId?: string
  baseUnit?: string
  baseUnitName?: string
  conversionFactor?: number
}
