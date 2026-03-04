import {Injectable} from '@angular/core'
import {ProductService} from '../../cross-tier/product/product.service'
import {OrganizationProduct} from './organization-product.model'
import {OrganizationProductStore} from './organization-product.store'

@Injectable({providedIn: 'root'})
export class OrganizationProductService extends ProductService<OrganizationProduct> {

  constructor(protected override readonly store: OrganizationProductStore) {
    super(store)
  }
}
