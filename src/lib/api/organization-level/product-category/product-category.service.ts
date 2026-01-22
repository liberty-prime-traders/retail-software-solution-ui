import {Injectable} from '@angular/core'
import {BaseService} from '../../util/base-api/base.service'
import {ProductCategory} from './product-category.model'
import {ProductCategoryStore} from './product-category.store'

@Injectable({providedIn: 'root'})
export class ProductCategoryService extends BaseService<ProductCategory> {

  constructor(protected override readonly store: ProductCategoryStore) {
    super(store)
  }
}
