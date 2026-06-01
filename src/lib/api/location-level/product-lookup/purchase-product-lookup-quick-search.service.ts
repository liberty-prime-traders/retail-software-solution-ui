import {Injectable} from '@angular/core'
import {ProductSearchParameters} from '../../cross-tier/product/product-search-parameters.model'
import {ProductStatus} from '../../cross-tier/product/product-status.enum'
import {ProductForPurchase} from './product-for-purchase.model'
import {PaginatedBaseService} from '../../util/paginated-api/paginated-base.service'
import {PurchaseProductLookupStore} from './purchase-product-lookup.store'

@Injectable()
export class PurchaseProductLookupQuickSearchService
  extends PaginatedBaseService<ProductForPurchase, ProductSearchParameters> {

  protected override readonly defaultCursor = ''
  protected override readonly BATCH_SIZE = 10
  protected override readonly urlSuffix: string = ''

  constructor(protected override readonly store: PurchaseProductLookupStore) {
    super(store)
  }

  fetchProducts(searchText: string, excludeIds: string[] = []) {
    const searchParameters: ProductSearchParameters = {searchText, excludeIds, statusList: [ProductStatus.ACTIVE]}
    return this.refetch(searchParameters)
  }
}
