import {BaseModel} from '../../util/base-api/base.model'

export interface UnitGroup extends BaseModel{
  name?: string
  description?: string
  createdBy?: string
  createdOn?: number
}
