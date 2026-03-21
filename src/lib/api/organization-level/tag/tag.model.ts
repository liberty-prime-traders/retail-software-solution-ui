import {CategoryType} from './category-type.enum'
import {BaseModel} from '../../util/base-api/base.model'

export interface Tag extends BaseModel{
  createdBy?: string
  createdOn?: number
  category?: CategoryType
  tagName?: string
  description?: string
}
