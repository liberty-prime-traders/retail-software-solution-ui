import {Injectable} from '@angular/core'
import {Subscription} from 'rxjs'
import {BaseService} from '../../util/base-api/base.service'
import {Product} from './product.model'
import {ProductStore} from './product.store'


@Injectable({providedIn: 'root'})
export class ProductService extends BaseService<Product> {
  constructor(protected override readonly store: ProductStore) {
    super(store)
  }

  deactivateProduct(productId: string): Subscription {
    this.patchApiRequestConfig({urlSuffix: 'deactivate'})
    return this.putWithId(productId)
  }

  reactivateProduct(productId: string): Subscription {
    this.patchApiRequestConfig({urlSuffix: 'reactivate'})
    return this.putWithId(productId)
  }
}
