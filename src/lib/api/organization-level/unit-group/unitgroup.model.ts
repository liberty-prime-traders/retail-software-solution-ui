import {EntityId} from '@ngrx/signals/entities'
import {BaseModel} from '../../util/base-api/base.model'

export interface UnitGroup extends BaseModel{
  name: string
  description: string
  systemDefined: boolean
  createdBy: string
  createdOn: number
}

export interface UnitGroupUpdateRequest {
  id: EntityId
  name: string
  description: string
}

export interface UnitGroupCreateRequest extends Omit<UnitGroupUpdateRequest, 'id'> {
  baseUnitName?: string
  baseUnitCode?: string
}
