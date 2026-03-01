import {Injectable} from '@angular/core'
import {ProductSearchParameters} from '../../cross-tier/product/product-search-parameters.model'
import {createPaginatedBaseStore, PaginatedBaseStore} from '../../util/paginated-api/paginated-base.store'
import {OrganizationProduct} from './organization-product.model'

@Injectable({providedIn: 'root'})
export class OrganizationProductStore extends createPaginatedBaseStore<OrganizationProduct, ProductSearchParameters>()
  implements PaginatedBaseStore<OrganizationProduct, ProductSearchParameters> {

  readonly basePath = 'products'
}
