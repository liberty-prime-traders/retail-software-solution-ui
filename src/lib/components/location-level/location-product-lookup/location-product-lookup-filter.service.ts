import {inject, Injectable} from '@angular/core'
import {
  LocationProductQuickSearchService
} from '../../../api/location-level/location-product/location-product-quick-search.service'
import {LocationProduct} from '../../../api/location-level/location-product/location-product.model'
import {ProductFilterService} from '../../cross-tier/product/product-filter.service'

@Injectable()
export class LocationProductLookupFilterService extends ProductFilterService<LocationProduct> {
  constructor() {
    super(inject(LocationProductQuickSearchService))
  }
}
