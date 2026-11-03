import {inject, Injectable} from '@angular/core'
import {ProductService} from '../../cross-tier/product/product.service'
import {ApiRequestContext} from '../../util/base-api/api-request-config'
import {OrganizationProductSearchService} from './organization-product-search.service'
import {OrganizationProduct} from './organization-product.model'
import {OrganizationProductStore} from './organization-product.store'

@Injectable({providedIn: 'root'})
export class OrganizationProductService extends ProductService<OrganizationProduct> {

  private readonly organizationProductSearchService = inject(OrganizationProductSearchService)

  constructor(protected override readonly store: OrganizationProductStore) {
    super(store)
  }

  override finishSavingWithSuccess(savedProduct: OrganizationProduct, request?: ApiRequestContext): void {
    super.finishSavingWithSuccess(savedProduct, request)
    this.organizationProductSearchService.pushToPaginatedEntities([savedProduct])
  }
}
