import {BaseModel} from '../../util/base-api/base.model'
import {Tag} from '../tag/tag.model'
import {ProductStatus} from './product-status.enum'

export interface Product extends BaseModel{
  createdBy?: string
  createdOn?: number
  productName?: string
  description?: string
  categoryName?: string
  categoryId?: string
  baseUnit?: string
  baseUnitId?: string
  status?: ProductStatus
  activeTags?: TagSummary[]
  tagsToAdd?: string[],
  tagsToRemove?: string[],
  cursor?: number,
  similarityScore?: number
}

export type TagSummary = Pick<Tag, 'id' | 'tagName'>
