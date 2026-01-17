import {Injectable} from '@angular/core'
import {BaseService} from '../../util/base-api/base.service'
import {ProductGroup} from './product-group.model'
import {ProductGroupStore} from './product-group.store'


@Injectable({providedIn: 'root'})
export class ProductGroupService extends BaseService<ProductGroup> {
  constructor(protected override readonly store: ProductGroupStore) {
    super(store)
  }
}
