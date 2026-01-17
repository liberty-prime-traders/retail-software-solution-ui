import {BaseModel} from '../../util/base-api/base.model'

export interface ProductGroup extends BaseModel {
  groupName?: string
  description?: string
  categoryId?: string
  categoryName?: string
  createdBy?: string
  createdOn?: number
}
