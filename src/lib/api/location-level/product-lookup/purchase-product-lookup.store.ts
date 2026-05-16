import {Injectable} from '@angular/core'
import {ProductSearchParameters} from '../../cross-tier/product/product-search-parameters.model'
import {PurchaseProductLookup} from '../../cross-tier/product/purchase-product-lookup.model'
import {createPaginatedBaseStore, PaginatedBaseStore} from '../../util/paginated-api/paginated-base.store'

@Injectable({providedIn: 'root'})
export class PurchaseProductLookupStore
  extends createPaginatedBaseStore<PurchaseProductLookup, ProductSearchParameters>()
  implements PaginatedBaseStore<PurchaseProductLookup, ProductSearchParameters> {

  readonly basePath = 'location-products/for-purchase'
}
