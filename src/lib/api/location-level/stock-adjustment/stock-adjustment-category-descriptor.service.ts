import {Injectable} from '@angular/core'
import {BaseService} from '../../util/base-api/base.service'
import {StockAdjustmentCategoryDescriptor} from './stock-adjustment-category-descriptor.model'
import {StockAdjustmentCategoryDescriptorStore} from './stock-adjustment-category-descriptor.store'

@Injectable({providedIn: 'root'})
export class StockAdjustmentCategoryDescriptorService extends BaseService<StockAdjustmentCategoryDescriptor> {
  constructor(protected override readonly store: StockAdjustmentCategoryDescriptorStore) {
    super(store)
  }
}
