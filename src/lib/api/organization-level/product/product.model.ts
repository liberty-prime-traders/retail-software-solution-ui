import {BaseModel} from '../../util/base-api/base.model'
import {EntityId} from '@ngrx/signals/entities'

export interface Product extends BaseModel{
  createdBy?: string
  createdOn?: number
  productName?: string
  description?: string
  categoryName?: string
  categoryId?: EntityId
  baseUnit?: string
  tags?: TagSummary[]
}

export interface TagSummary {
  id: EntityId
  tagName: string
}
