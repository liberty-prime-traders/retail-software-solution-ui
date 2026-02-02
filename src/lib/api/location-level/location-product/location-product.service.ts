import {Injectable} from '@angular/core'
import {ProductService} from '../../cross-tier/product/product.service'
import {LocationProductSearchStore} from '../location-product-search/location-product-search.store'
import {LocationProduct} from './location-product.model'

@Injectable({providedIn: 'root'})
export class LocationProductService extends ProductService<LocationProduct> {

  protected readonly basePath = '/secured/location-products'

  constructor(protected override readonly store: LocationProductSearchStore) {
    super(store)
  }
}
