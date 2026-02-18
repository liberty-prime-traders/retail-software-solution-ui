import {PaginatedModel} from '../../util/paginated-api/paginated.model'
import {ProductStatus} from './product-status.enum'

export interface BaseProduct extends PaginatedModel {
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
