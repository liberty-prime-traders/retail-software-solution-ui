import {EntityId} from '@ngrx/signals/entities'
import {BaseModel} from '../../util/base-api/base.model'

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

export interface TagSummary {
  id: EntityId
  tagName: string
}
