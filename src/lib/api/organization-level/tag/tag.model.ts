import {BaseModel} from '../../util/base-api/base.model'
import {CategoryType} from '../category/category-type.enum'

export interface Tag extends BaseModel{
  createdBy?: string
  createdOn?: number
  category?: CategoryType
  tagName?: string
  description?: string
}
