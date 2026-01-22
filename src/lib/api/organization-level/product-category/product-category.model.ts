import {BaseModel} from '../../util/base-api/base.model'


export interface ProductCategory extends BaseModel{
  createdBy?: string
  createdOn?: number
  categoryName?: string
  description?: string
}
