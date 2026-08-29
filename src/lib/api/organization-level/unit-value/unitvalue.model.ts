import {EntityId} from '@ngrx/signals/entities'
import {BaseModel} from '../../util/base-api/base.model'

export interface UnitValue extends BaseModel{
  name: string
  code: string
  description?: string
  unitGroupId?: EntityId
  baseUnit?: string
  systemDefined: boolean
  baseUnitName?: string
  unitsOfBasePerUnit?: number
}
