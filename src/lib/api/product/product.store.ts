import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../base-api/base.store'
import {Product} from './product.model'


@Injectable({providedIn: 'root'})
export class ProductStore extends createBaseStore<Product>() implements BaseStore<Product> {
  readonly basePath = 'products'
}
