import {ProductCore} from '../../../api/cross-tier/product/product-core.model'
import {ProductSearchParameters} from '../../../api/cross-tier/product/product-search-parameters.model'
import {PaginatedBaseService} from '../../../api/util/paginated-api/paginated-base.service'
import {PaginatedModel} from '../../../api/util/paginated-api/paginated.model'
import {BaseFilterService} from '../../../utils/services/base-filter.service'

export abstract class ProductLookupFilterService<LOOKUP extends ProductCore & PaginatedModel>
  extends BaseFilterService<LOOKUP, ProductSearchParameters> {

  readonly filteredProducts = this.filteredEntities

  protected constructor(
    protected override readonly searchService: PaginatedBaseService<LOOKUP, ProductSearchParameters>
  ) {
    super(searchService)
  }

  override getFilterForm() {
    return this.formBuilder.group({
      searchText: ['']
    })
  }

  protected override convertFormValueToSearchParameters(): ProductSearchParameters {
    return {searchText: this.filterForm.value.searchText}
  }

  protected override detectAdvancedFiltersApplied(): boolean {
    return false
  }

  override afterExternalParametersReset(parameters: Partial<ProductSearchParameters>) {
    if (parameters.excludeIds) {
      this.removeEntities(parameters.excludeIds)
    }
  }

  protected override passesClientSideFilters(
    product: LOOKUP, externalParameters: Partial<ProductSearchParameters>
  ): boolean {
    const searchText = (this.filterForm.value.searchText ?? '').trim().toLowerCase()
    if (searchText) {
      const haystack = [product.productName, product.referenceNumber, product.productGroupName]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(searchText)) return false
    }
    return !externalParameters.excludeIds?.includes(product.id)
  }
}
