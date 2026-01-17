import {Injectable} from '@angular/core'
import {createPaginatedBaseStore, PaginatedBaseStore} from '../../util/paginated-api/paginated-base.store'
import {Product} from '../product/product.model'
import {ProductSearchParameters} from './product-search-parameters.model'

@Injectable({providedIn: 'root'})
export class ProductSearchStore extends createPaginatedBaseStore<Product, ProductSearchParameters>()
  implements PaginatedBaseStore<Product, ProductSearchParameters> {

  readonly basePath = 'products/structured-search'
}
