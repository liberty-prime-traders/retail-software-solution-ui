import {Injectable} from '@angular/core'
import {ProductSearchParameters} from '../../cross-tier/product/product-search-parameters.model'
import {createPaginatedBaseStore, PaginatedBaseStore} from '../../util/paginated-api/paginated-base.store'
import {LocationProduct} from '../location-product/location-product.model'

@Injectable({providedIn: 'root'})
export class LocationProductSearchStore extends createPaginatedBaseStore<LocationProduct, ProductSearchParameters>()
  implements PaginatedBaseStore<LocationProduct, ProductSearchParameters> {

  readonly basePath = 'location-products/search'
}
