import {EntityId} from '@ngrx/signals/entities'
import {ProductStatus} from './product-status.enum'

export interface ProductSearchParameters {
  searchText?: string
  referenceNumber?: string
  categoryIds?: string[]
  tagIds?: string[]
  statusList?: ProductStatus[]
  excludeIds?: EntityId[]
}
