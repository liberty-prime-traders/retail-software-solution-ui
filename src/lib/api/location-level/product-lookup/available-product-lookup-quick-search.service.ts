import {Injectable} from '@angular/core'
import {ProductSearchParameters} from '../../cross-tier/product/product-search-parameters.model'
import {PaginatedBaseService} from '../../util/paginated-api/paginated-base.service'
import {AvailableProductLookupStore} from './available-product-lookup.store'
import {ProductWithAvailability} from './product-with-availability.model'

@Injectable()
export class AvailableProductLookupQuickSearchService
  extends PaginatedBaseService<ProductWithAvailability, ProductSearchParameters> {

  protected override readonly defaultCursor = ''
  protected override readonly BATCH_SIZE = 10
  protected override readonly urlSuffix: string = ''

  constructor(protected override readonly store: AvailableProductLookupStore) {
    super(store)
  }

  fetchProducts(searchText: string, excludeIds: string[] = []) {
    const searchParameters: ProductSearchParameters = {searchText, excludeIds}
    return this.refetch(searchParameters)
  }
}
