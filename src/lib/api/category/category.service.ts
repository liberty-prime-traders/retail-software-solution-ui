import {Injectable} from '@angular/core'
import {BaseService} from '../base-api/base.service'
import {Category} from './category.model'
import {CategoryStore} from './category.store'
import {CategoryState} from './category.state'
import {CategoryQuery} from './category.query'


@Injectable({providedIn: 'root'})
export class CategoryService extends BaseService<Category, CategoryState> {
  constructor(protected override readonly store: CategoryStore,
              protected override readonly query: CategoryQuery) {
    super(store, query)
  }
}
