import {BaseModel} from '../../util/base-api/base.model'
import {Tag} from '../tag/tag.model'

export interface Product extends BaseModel{
  createdBy?: string
  createdOn?: number
  productName?: string
  description?: string
  categoryName?: string
  categoryId?: string
  baseUnit?: string
  baseUnitId?: string
  activeTags?: TagSummary[]
  tagsToAdd?: string[],
  tagsToRemove?: string[]
}

export type TagSummary = Pick<Tag, 'id' | 'tagName'>
