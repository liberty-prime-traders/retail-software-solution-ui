import {PaginatedModel} from '../../util/paginated-api/paginated.model'
import {ProductCore} from './product-core.model'
import {ProductStatus} from './product-status.enum'

export interface ProductDetail extends ProductCore, PaginatedModel {
  baseUnit?: string
  description?: string
  status?: ProductStatus
  createdBy?: string
  createdOn?: number
  categoryId?: string
  productGroupId?: string
}
