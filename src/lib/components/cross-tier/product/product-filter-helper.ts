import {FormGroup} from '@angular/forms'
import {BaseProduct} from '../../../api/cross-tier/product/base-product.model'
import {ProductStatus} from '../../../api/cross-tier/product/product-status.enum'

export class ProductFilterHelper<PRODUCT extends BaseProduct> {
  constructor(private readonly filterForm: FormGroup){}

  readonly matchesSearchText = (product: PRODUCT): boolean => {
    const searchText = this.filterForm.value.searchText?.trim().toLowerCase()
    if (!searchText) return true

    const productName = (product.productName)?.toLowerCase()
    return productName?.includes(searchText) ||
      product.referenceNumber?.toLowerCase().includes(searchText) ||
      product.description?.toLowerCase().includes(searchText) ||
      product.productGroupName?.toLowerCase().includes(searchText) ||
      false
  }

  readonly matchesReferenceNumber = (product: PRODUCT): boolean => {
    const referenceNumberFilter = this.filterForm.value.referenceNumber?.trim()
    if (!referenceNumberFilter) return true
    return product.referenceNumber?.toLowerCase().includes(referenceNumberFilter.toLowerCase()) ?? false
  }

  readonly matchesSelectedStatus = (product: PRODUCT): boolean => {
    const selectedStatuses = new Set(this.filterForm.value.statusList ?? [])
    if (selectedStatuses.size === 0) return true
    if (!product.status) return false
    return selectedStatuses.has(product.status)
  }

  readonly detectBasicAdvancedFiltersApplied= () : boolean => {
    const referenceNumberPopulated = !!this.filterForm.get('referenceNumber')?.value
    const categoryIdsPopulated = (this.filterForm.get('categoryIds')?.value ?? []).length > 0
    const tagIdsPopulated = (this.filterForm.get('tagIds')?.value ?? []).length > 0
    const statusList = this.filterForm.get('statusList')?.value ?? []
    const statusListPopulated = statusList.length > 1
      || (statusList.length === 1 && statusList[0] !== ProductStatus.ACTIVE)

    return referenceNumberPopulated || categoryIdsPopulated || tagIdsPopulated || statusListPopulated
  }

  readonly hasAllSelectedTags = (product: PRODUCT): boolean => {
    const selectedTagIds = (this.filterForm.value.tagIds ?? []) as string[]
    if (selectedTagIds.length === 0) return true
    const productTagIds = new Set((product as any).activeTags?.map((tag: any) => String(tag.id)) ?? [])
    return selectedTagIds.every(tagId => productTagIds.has(tagId))
  }

  readonly belongsToSelectedCategories = (
    product: PRODUCT, getGroupIdsForCategories: (categoryIds: Set<string>)=> string[]
  ): boolean => {

    const selectedCategoryIds = new Set<string>(this.filterForm.value.categoryIds ?? [])
    if (selectedCategoryIds.size === 0) return true

    if (product.categoryId) {
      return selectedCategoryIds.has(product.categoryId)
    }

    if (product.productGroupId) {
      const allowedProductGroupIds = new Set(getGroupIdsForCategories(selectedCategoryIds))
      return allowedProductGroupIds.has(product.productGroupId)
    }
    return false
  }
}
