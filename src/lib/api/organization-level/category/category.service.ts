import {Injectable} from '@angular/core'
import {BaseService} from '../../util/base-api/base.service'
import {Category} from './category.model'
import {CategoryStore} from './category.store'

@Injectable({providedIn: 'root'})
export class CategoryService extends BaseService<Category> {
  constructor(protected override readonly store: CategoryStore) {
    super(store)
  }
}
