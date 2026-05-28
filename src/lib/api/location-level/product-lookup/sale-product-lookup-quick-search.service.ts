import {Injectable} from '@angular/core'
import {ProductSearchParameters} from '../../cross-tier/product/product-search-parameters.model'
import {PaginatedBaseService} from '../../util/paginated-api/paginated-base.service'
import {ProductForSale} from './product-for-sale.model'
import {SaleProductLookupStore} from './sale-product-lookup.store'

@Injectable()
export class SaleProductLookupQuickSearchService
  extends PaginatedBaseService<ProductForSale, ProductSearchParameters> {

  protected override readonly defaultCursor = ''
  protected override readonly BATCH_SIZE = 10
  protected override readonly urlSuffix: string = ''

  constructor(protected override readonly store: SaleProductLookupStore) {
    super(store)
  }

  fetchProducts(searchText: string, excludeIds: string[] = []) {
    const searchParameters: ProductSearchParameters = {searchText, excludeIds}
    return this.refetch(searchParameters)
  }
}
