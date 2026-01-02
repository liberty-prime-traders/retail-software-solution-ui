import {computed, Injectable} from '@angular/core'
import {BaseService} from '../../util/base-api/base.service'
import {CategoryType} from '../category/category-type.enum'
import {Tag} from './tag.model'
import {TagStore} from './tag.store'

@Injectable({providedIn: 'root'})
export class TagService extends BaseService<Tag> {

  readonly productTags = computed(() =>
    this.selectAll().filter(tag => tag.category === CategoryType.PRODUCT)
  )

  constructor(protected override readonly store: TagStore) {
    super(store)
  }
}
