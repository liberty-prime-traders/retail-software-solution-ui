import {inject, Injectable} from '@angular/core'
import {ProductSearchParameters} from '../../../api/cross-tier/product/product-search-parameters.model'
import {LocationProduct} from '../../../api/location-level/location-product/location-product.model'
import {PaginatedBaseService} from '../../../api/util/paginated-api/paginated-base.service'
import {ProductFilterService} from '../../cross-tier/product/product-filter.service'

@Injectable({providedIn: 'root'})
export class LocationProductFilterService extends ProductFilterService<LocationProduct> {
  constructor() {
    super(inject(PaginatedBaseService<LocationProduct, ProductSearchParameters>))
  }
}
