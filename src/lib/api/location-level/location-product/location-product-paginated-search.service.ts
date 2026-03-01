import {Injectable} from '@angular/core'
import {ProductSearchParameters} from '../../cross-tier/product/product-search-parameters.model'
import {PaginatedBaseService} from '../../util/paginated-api/paginated-base.service'
import {LocationProduct} from './location-product.model'
import {LocationProductStore} from './location-product.store'

@Injectable({providedIn: 'root'})
export class LocationProductPaginatedSearchService extends PaginatedBaseService<LocationProduct, ProductSearchParameters> {
  protected override readonly defaultCursor = ''

  constructor(protected override readonly store: LocationProductStore) {
    super(store)
  }
}
