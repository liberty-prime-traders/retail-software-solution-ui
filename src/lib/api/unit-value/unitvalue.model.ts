import {BaseModel} from '../base-api/base.model'

export interface UnitValue extends BaseModel{
  name?: string
  code?: string
  description?: string
  baseUnit?: string
  conversionFactor?: number
  createdBy?: string
  createdOn?: number
  usageCount?: number
}
