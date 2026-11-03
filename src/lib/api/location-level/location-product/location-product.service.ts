import {inject, Injectable} from '@angular/core'
import {ProductService} from '../../cross-tier/product/product.service'
import {ApiRequestContext} from '../../util/base-api/api-request-config'
import {LocationProductPaginatedSearchService} from './location-product-paginated-search.service'
import {LocationProduct} from './location-product.model'
import {LocationProductStore} from './location-product.store'

@Injectable({providedIn: 'root'})
export class LocationProductService extends ProductService<LocationProduct> {

  private readonly locationProductPaginatedSearchService = inject(LocationProductPaginatedSearchService)

  constructor(protected override readonly store: LocationProductStore) {
    super(store)
  }

  override finishSavingWithSuccess(savedProduct: LocationProduct, request?: ApiRequestContext): void {
    super.finishSavingWithSuccess(savedProduct, request)
    this.locationProductPaginatedSearchService.pushToPaginatedEntities([savedProduct])
  }
}
