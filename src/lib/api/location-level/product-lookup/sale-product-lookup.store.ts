import {Injectable} from '@angular/core'
import {ProductSearchParameters} from '../../cross-tier/product/product-search-parameters.model'
import {SaleProductLookup} from '../../cross-tier/product/sale-product-lookup.model'
import {createPaginatedBaseStore, PaginatedBaseStore} from '../../util/paginated-api/paginated-base.store'

@Injectable({providedIn: 'root'})
export class SaleProductLookupStore extends createPaginatedBaseStore<SaleProductLookup, ProductSearchParameters>()
  implements PaginatedBaseStore<SaleProductLookup, ProductSearchParameters> {

  readonly basePath = 'location-products/search-for-sale'
}
