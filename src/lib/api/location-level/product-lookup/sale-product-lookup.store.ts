import {Injectable} from '@angular/core'
import {ProductSearchParameters} from '../../cross-tier/product/product-search-parameters.model'
import {ProductForSale} from './product-for-sale.model'
import {createPaginatedBaseStore, PaginatedBaseStore} from '../../util/paginated-api/paginated-base.store'

@Injectable({providedIn: 'root'})
export class SaleProductLookupStore extends createPaginatedBaseStore<ProductForSale, ProductSearchParameters>()
  implements PaginatedBaseStore<ProductForSale, ProductSearchParameters> {

  readonly basePath = 'location-products/search-for-sale'
}
