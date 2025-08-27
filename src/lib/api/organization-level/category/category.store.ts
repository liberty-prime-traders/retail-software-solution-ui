import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {Category} from './category.model'

@Injectable({providedIn: 'root'})
export class CategoryStore extends createBaseStore<Category>() implements BaseStore<Category> {
  readonly basePath = 'category'
}
