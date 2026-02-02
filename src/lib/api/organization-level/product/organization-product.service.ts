import {Injectable} from '@angular/core'
import {ProductService} from '../../cross-tier/product/product.service'
import {OrganizationProductSearchStore} from '../product-search/organization-product-search.store'
import {OrganizationProduct} from './organization-product.model'

@Injectable({providedIn: 'root'})
export class OrganizationProductService extends ProductService<OrganizationProduct> {

  protected readonly basePath = '/secured/products'

  constructor(protected override readonly store: OrganizationProductSearchStore) {
    super(store)
  }
}
