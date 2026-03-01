import {Injectable} from '@angular/core'
import {ProductService} from '../../cross-tier/product/product.service'
import {OrganizationProductStore} from './organization-product.store'
import {OrganizationProduct} from './organization-product.model'

@Injectable({providedIn: 'root'})
export class OrganizationProductService extends ProductService<OrganizationProduct> {

  constructor(protected override readonly store: OrganizationProductStore) {
    super(store)
  }
}
