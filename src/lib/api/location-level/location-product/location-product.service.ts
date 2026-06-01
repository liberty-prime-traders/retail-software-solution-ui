import {inject, Injectable} from '@angular/core'
import {ProductService} from '../../cross-tier/product/product.service'
import {LocationProductPaginatedSearchService} from './location-product-paginated-search.service'
import {LocationProduct} from './location-product.model'
import {LocationProductStore} from './location-product.store'

@Injectable({providedIn: 'root'})
export class LocationProductService extends ProductService<LocationProduct> {

  private readonly locationProductPaginatedSearchService = inject(LocationProductPaginatedSearchService)

  constructor(protected override readonly store: LocationProductStore) {
    super(store)
  }

  override finishSavingWithSuccess(savedProduct: LocationProduct): void {
    super.finishSavingWithSuccess(savedProduct)
    this.locationProductPaginatedSearchService.pushToPaginatedEntities([savedProduct])
  }
}
