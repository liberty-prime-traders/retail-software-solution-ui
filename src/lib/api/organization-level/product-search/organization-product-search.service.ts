import {Injectable} from '@angular/core'
import {ProductSearchParameters} from '../../cross-tier/product/product-search-parameters.model'
import {PaginatedBaseService} from '../../util/paginated-api/paginated-base.service'
import {OrganizationProduct} from '../product/organization-product.model'
import {OrganizationProductSearchStore} from './organization-product-search.store'

@Injectable()
export class OrganizationProductSearchService extends PaginatedBaseService<OrganizationProduct, ProductSearchParameters> {
  protected override readonly defaultCursor = ''

  constructor(protected override readonly store: OrganizationProductSearchStore) {
    super(store)
  }
}
