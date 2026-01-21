import {computed, Injectable} from '@angular/core'
import {BaseService} from '../../util/base-api/base.service'
import {CategoryType} from './category-type.enum'
import {Category} from './category.model'
import {CategoryStore} from './category.store'

@Injectable({providedIn: 'root'})
export class CategoryService extends BaseService<Category> {

  readonly productCategories = computed(() =>
    this.selectAll().filter(category => category.categoryType === CategoryType.PRODUCT)
  )

  constructor(protected override readonly store: CategoryStore) {
    super(store)
  }
}
