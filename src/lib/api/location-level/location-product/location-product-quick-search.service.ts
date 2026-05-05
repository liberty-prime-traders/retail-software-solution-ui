import {Injectable} from '@angular/core'
import {ProductSearchParameters} from '../../cross-tier/product/product-search-parameters.model'
import {ProductStatus} from '../../cross-tier/product/product-status.enum'
import {PaginatedBaseService} from '../../util/paginated-api/paginated-base.service'
import {LocationProduct} from './location-product.model'
import {LocationProductStore} from './location-product.store'

@Injectable()
export class LocationProductQuickSearchService extends PaginatedBaseService<LocationProduct, ProductSearchParameters> {

  protected override readonly defaultCursor = ''
  protected override readonly BATCH_SIZE = 10

  constructor(protected override readonly store: LocationProductStore) {
    super(store)
  }

  fetchProducts(searchText: string, excludeIds: string[] = []) {
    const searchParameters: ProductSearchParameters = {searchText, excludeIds, statusList: [ProductStatus.ACTIVE]}
    return this.refetch(searchParameters)
  }

}
