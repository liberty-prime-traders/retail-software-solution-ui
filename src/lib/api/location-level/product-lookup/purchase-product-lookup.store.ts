import {Injectable} from '@angular/core'
import {ProductSearchParameters} from '../../cross-tier/product/product-search-parameters.model'
import {ProductForPurchase} from './product-for-purchase.model'
import {createPaginatedBaseStore, PaginatedBaseStore} from '../../util/paginated-api/paginated-base.store'

@Injectable({providedIn: 'root'})
export class PurchaseProductLookupStore
  extends createPaginatedBaseStore<ProductForPurchase, ProductSearchParameters>()
  implements PaginatedBaseStore<ProductForPurchase, ProductSearchParameters> {

  readonly basePath = 'location-products/search-for-purchase'
}
