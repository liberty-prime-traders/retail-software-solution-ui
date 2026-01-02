import {BaseModel} from '../../util/base-api/base.model'
import {CategoryType} from './category-type.enum'

export interface Category extends BaseModel{
  createdBy?: string
  createdOn?: number
  categoryType?: CategoryType
  categoryName?: string
  description?: string
}
