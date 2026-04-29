import {BaseModel} from '../../util/base-api/base.model'

export interface UnitGroup extends BaseModel{
  name: string
  description: string
  systemDefined: boolean
  createdBy: string
  createdOn: number
}
