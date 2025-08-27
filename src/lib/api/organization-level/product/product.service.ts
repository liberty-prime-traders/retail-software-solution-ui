import {Injectable} from '@angular/core'
import {BaseService} from '../../util/base-api/base.service'
import {Product} from './product.model'
import {ProductStore} from './product.store'


@Injectable({providedIn: 'root'})
export class ProductService extends BaseService<Product> {
  constructor(protected override readonly store: ProductStore) {
    super(store)
  }
}
