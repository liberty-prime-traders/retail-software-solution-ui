import {Injectable} from '@angular/core'
import {ProductSearchParameters} from '../../cross-tier/product/product-search-parameters.model'
import {PaginatedBaseService} from '../../util/paginated-api/paginated-base.service'
import {LocationProduct} from '../location-product/location-product.model'
import {LocationProductSearchStore} from './location-product-search.store'

@Injectable()
export class LocationProductSearchService extends PaginatedBaseService<LocationProduct, ProductSearchParameters> {
  protected override readonly defaultCursor = ''

  constructor(protected override readonly store: LocationProductSearchStore) {
    super(store)
  }
}
