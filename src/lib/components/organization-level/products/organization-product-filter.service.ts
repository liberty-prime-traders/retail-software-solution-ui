import {inject, Injectable} from '@angular/core'
import {
  OrganizationProductSearchService
} from '../../../api/organization-level/product-search/organization-product-search.service'
import {OrganizationProduct} from '../../../api/organization-level/product/organization-product.model'
import {ProductFilterService} from '../../cross-tier/product/product-filter.service'

@Injectable({providedIn: 'root'})
export class OrganizationProductFilterService extends ProductFilterService<OrganizationProduct> {
  constructor() {
    super(inject(OrganizationProductSearchService))
  }
}
