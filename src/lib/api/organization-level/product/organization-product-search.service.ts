import {Injectable} from '@angular/core'
import {ProductSearchParameters} from '../../cross-tier/product/product-search-parameters.model'
import {PaginatedBaseService} from '../../util/paginated-api/paginated-base.service'
import {OrganizationProduct} from './organization-product.model'
import {OrganizationProductStore} from './organization-product.store'

@Injectable({providedIn: 'root'})
export class OrganizationProductSearchService extends PaginatedBaseService<OrganizationProduct, ProductSearchParameters> {
  protected override readonly defaultCursor = ''

  constructor(protected override readonly store: OrganizationProductStore) {
    super(store)
  }
}
