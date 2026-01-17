import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {ProductGroup} from './product-group.model'


@Injectable({providedIn: 'root'})
export class ProductGroupStore extends createBaseStore<ProductGroup>() implements BaseStore<ProductGroup> {
  readonly basePath = 'product-groups'
}
