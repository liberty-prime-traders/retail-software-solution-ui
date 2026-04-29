import {inject} from '@angular/core'
import {Validators} from '@angular/forms'
import {BaseProduct} from '../../../api/cross-tier/product/base-product.model'
import {ProductSearchParameters} from '../../../api/cross-tier/product/product-search-parameters.model'
import {ProductStatus} from '../../../api/cross-tier/product/product-status.enum'
import {ProductGroupService} from '../../../api/organization-level/product-group/product-group.service'
import {PaginatedBaseService} from '../../../api/util/paginated-api/paginated-base.service'
import {BaseFilterService} from '../../../utils/services/base-filter.service'
import {ProductFilterHelper} from './product-filter-helper'


export abstract class ProductFilterService<PRODUCT extends BaseProduct>
  extends BaseFilterService<PRODUCT, ProductSearchParameters> {

  private readonly productGroupService = inject(ProductGroupService)
  private readonly productFilterHelper = new ProductFilterHelper(this.filterForm)

  readonly filteredProducts = this.filteredEntities

  protected override detectAdvancedFiltersApplied = this.productFilterHelper.detectBasicAdvancedFiltersApplied

  protected constructor(
    protected override readonly searchService: PaginatedBaseService<PRODUCT, ProductSearchParameters>
  ) {
    super(searchService)
  }

  override getFilterForm(){
    return this.formBuilder.group({
      searchText: [''],
      referenceNumber: [''],
      categoryIds: [[]],
      tagIds: [[]],
      productGroupNames: [[]],
      statusList: [[ProductStatus.ACTIVE], [Validators.required]]
    })
  }

  protected override convertFormValueToSearchParameters(): ProductSearchParameters {
    const formValue = this.filterForm.value
    return {
      searchText: formValue.searchText,
      referenceNumber: formValue.referenceNumber,
      categoryIds: formValue.categoryIds,
      tagIds: formValue.tagIds,
      statusList: formValue.statusList
    } as ProductSearchParameters
  }

  protected override passesClientSideFilters(product: PRODUCT): boolean {
    if (!this.productFilterHelper.matchesSearchText(product)) return false
    if (!this.filterForm.valid) return true

    return (
      this.productFilterHelper.matchesReferenceNumber(product) &&
      this.productFilterHelper.belongsToSelectedCategories(product, this.getProductGroupIdsForCategories) &&
      this.productFilterHelper.hasAllSelectedTags(product) &&
      this.productFilterHelper.matchesSelectedStatus(product)
    )
  }

  private getProductGroupIdsForCategories(categoryIds: Set<string>): string[] {
    return this.productGroupService.selectAll()
      .filter(pg => pg.categoryId && categoryIds.has(pg.categoryId))
      .map(pg => String(pg.id))
  }

}
