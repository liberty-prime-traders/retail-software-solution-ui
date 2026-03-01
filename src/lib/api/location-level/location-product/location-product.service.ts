import {Injectable} from '@angular/core'
import {ProductService} from '../../cross-tier/product/product.service'
import {LocationProductStore} from './location-product.store'
import {LocationProduct} from './location-product.model'

@Injectable({providedIn: 'root'})
export class LocationProductService extends ProductService<LocationProduct> {

  constructor(protected override readonly store: LocationProductStore) {
    super(store)
  }
}
