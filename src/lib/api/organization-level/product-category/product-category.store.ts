import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {ProductCategory} from './product-category.model'

@Injectable({providedIn: 'root'})
export class ProductCategoryStore extends createBaseStore<ProductCategory>() implements BaseStore<ProductCategory> {
  readonly basePath = 'product-category'
}
