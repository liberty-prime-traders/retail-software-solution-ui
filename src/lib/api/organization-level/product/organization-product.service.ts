import {inject, Injectable} from '@angular/core'
import {ProductService} from '../../cross-tier/product/product.service'
import {OrganizationProductSearchService} from './organization-product-search.service'
import {OrganizationProduct} from './organization-product.model'
import {OrganizationProductStore} from './organization-product.store'

@Injectable({providedIn: 'root'})
export class OrganizationProductService extends ProductService<OrganizationProduct> {

  private readonly organizationProductSearchService = inject(OrganizationProductSearchService)

  constructor(protected override readonly store: OrganizationProductStore) {
    super(store)
  }

  override finishSavingWithSuccess(savedProduct: OrganizationProduct): void {
    super.finishSavingWithSuccess(savedProduct)
    this.organizationProductSearchService.pushToPaginatedEntities([savedProduct])
  }
}
