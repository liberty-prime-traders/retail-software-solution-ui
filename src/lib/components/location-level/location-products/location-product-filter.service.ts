import {inject, Injectable} from '@angular/core'
import {LocationProductPaginatedSearchService} from '../../../api/location-level/location-product/location-product-paginated-search.service'
import {LocationProduct} from '../../../api/location-level/location-product/location-product.model'
import {ProductFilterService} from '../../cross-tier/product/product-filter.service'

@Injectable({providedIn: 'root'})
export class LocationProductFilterService extends ProductFilterService<LocationProduct> {
  constructor() {
    super(inject(LocationProductPaginatedSearchService))
  }
}
