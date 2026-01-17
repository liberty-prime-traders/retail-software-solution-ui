import {ProductStatus} from '../product/product-status.enum'

export interface ProductSearchParameters {
  searchText?: string
  referenceNumber?: string
  categoryIds?: string[]
  tagsIds?: string[]
  statusList?: ProductStatus[]
}
