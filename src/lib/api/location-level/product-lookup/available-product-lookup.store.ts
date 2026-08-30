import {Injectable} from '@angular/core'
import {ProductSearchParameters} from '../../cross-tier/product/product-search-parameters.model'
import {ProductWithAvailability} from './product-with-availability.model'
import {createPaginatedBaseStore, PaginatedBaseStore} from '../../util/paginated-api/paginated-base.store'

@Injectable({providedIn: 'root'})
export class AvailableProductLookupStore
  extends createPaginatedBaseStore<ProductWithAvailability, ProductSearchParameters>()
  implements PaginatedBaseStore<ProductWithAvailability, ProductSearchParameters> {

  readonly basePath = 'location-products/search-available'
}
