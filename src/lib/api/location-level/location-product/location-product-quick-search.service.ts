import {Injectable} from '@angular/core'
import {ProductSearchParameters} from '../../cross-tier/product/product-search-parameters.model'
import {ProductStatus} from '../../cross-tier/product/product-status.enum'
import {BaseService} from '../../util/base-api/base.service'
import {PageRequest} from '../../util/paginated-api/page-request.model'
import {LocationProductStore} from './location-product.store'
import {LocationProduct} from './location-product.model'

@Injectable()
export class LocationProductQuickSearchService extends BaseService<LocationProduct, PageRequest<ProductSearchParameters>> {
  private static readonly PAGE_SIZE = 10

  constructor(protected override readonly store: LocationProductStore) {
    super(store)
  }

  fetchProducts(searchText: string) {
    this.patchApiRequestConfig({urlSuffix: 'search'})
    const searchParameters: ProductSearchParameters = {searchText, statusList: [ProductStatus.ACTIVE]}
    const pageRequest: PageRequest<ProductSearchParameters> = {
      previousCursor: '',
      requestedSize: LocationProductQuickSearchService.PAGE_SIZE,
      parameters: searchParameters
    }
    return this.post(pageRequest)
  }
}
