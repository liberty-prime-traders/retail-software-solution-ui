import {ProductStatus} from './product-status.enum'
import {BaseModel} from '../../util/base-api/base.model'

export interface BaseProduct extends BaseModel {
  productName?: string
  createdBy?: string
  createdOn?: number
  description?: string
  productGroupName?: string
  status?: ProductStatus
  baseUnit?: string
  baseUnitId?: string
  categoryId?: string
  productGroupId?: string
}
