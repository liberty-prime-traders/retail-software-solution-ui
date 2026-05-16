import {ProductDetail} from '../../cross-tier/product/product-detail.model'
import {Tag} from '../tag/tag.model'

export interface OrganizationProduct extends ProductDetail {
  activeTags?: TagSummary[]
  tagsToAdd?: string[]
  tagsToRemove?: string[]
}

export type TagSummary = Pick<Tag, 'id' | 'tagName'>
