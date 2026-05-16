import {Injectable} from '@angular/core'
import {ProductSearchParameters} from '../../cross-tier/product/product-search-parameters.model'
import {ProductStatus} from '../../cross-tier/product/product-status.enum'
import {SaleProductLookup} from '../../cross-tier/product/sale-product-lookup.model'
import {PaginatedBaseService} from '../../util/paginated-api/paginated-base.service'
import {SaleProductLookupStore} from './sale-product-lookup.store'

@Injectable()
export class SaleProductLookupQuickSearchService
  extends PaginatedBaseService<SaleProductLookup, ProductSearchParameters> {

  protected override readonly defaultCursor = ''
  protected override readonly BATCH_SIZE = 10

  constructor(protected override readonly store: SaleProductLookupStore) {
    super(store)
  }

  fetchProducts(searchText: string, excludeIds: string[] = []) {
    const searchParameters: ProductSearchParameters = {searchText, excludeIds, statusList: [ProductStatus.ACTIVE]}
    return this.refetch(searchParameters)
  }
}
