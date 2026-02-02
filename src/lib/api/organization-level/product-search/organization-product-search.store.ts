import {Injectable} from '@angular/core'
import {createPaginatedBaseStore, PaginatedBaseStore} from '../../util/paginated-api/paginated-base.store'
import {ProductSearchParameters} from '../../cross-tier/product/product-search-parameters.model'
import {OrganizationProduct} from '../product/organization-product.model'

@Injectable({providedIn: 'root'})
export class OrganizationProductSearchStore extends createPaginatedBaseStore<OrganizationProduct, ProductSearchParameters>()
  implements PaginatedBaseStore<OrganizationProduct, ProductSearchParameters> {

  readonly basePath = 'products/search'
}
