import {BaseProduct} from '../../cross-tier/product/base-product.model'
import {Tag} from '../tag/tag.model'

export interface OrganizationProduct extends BaseProduct {
  productGroupId?: string
  activeTags?: TagSummary[]
  tagsToAdd?: string[],
  tagsToRemove?: string[]
}

export type TagSummary = Pick<Tag, 'id' | 'tagName'>
