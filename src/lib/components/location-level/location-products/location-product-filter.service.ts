import {inject, Injectable} from '@angular/core'
import {LocationProductSearchService} from '../../../api/location-level/location-product-search/location-product-search.service'
import {LocationProduct} from '../../../api/location-level/location-product/location-product.model'
import {ProductFilterService} from '../../cross-tier/product/product-filter.service'

@Injectable({providedIn: 'root'})
export class LocationProductFilterService extends ProductFilterService<LocationProduct> {
  constructor() {
    super(inject(LocationProductSearchService))
  }
}
