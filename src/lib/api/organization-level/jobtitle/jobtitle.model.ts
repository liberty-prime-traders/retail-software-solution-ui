import {BaseModel} from '../../util/base-api/base.model'

export interface JobTitle extends BaseModel{
  value?: string
  createdBy?: string
  createdOn?: number
  usageCount?: number
}
