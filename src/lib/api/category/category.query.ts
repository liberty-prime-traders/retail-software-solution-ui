import {Injectable} from '@angular/core'
import {Category} from './category.model'
import {CategoryState} from './category.state'
import {CategoryStore} from './category.store'
import {BaseQuery} from '../base-api/base.query'

@Injectable({providedIn: 'root'})
export class CategoryQuery extends BaseQuery<Category, CategoryState> {
  constructor(protected override readonly store: CategoryStore) {
    super(store)
  }
}
