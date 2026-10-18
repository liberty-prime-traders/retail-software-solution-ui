import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {StockAdjustmentCategoryDescriptor} from './stock-adjustment-category-descriptor.model'

@Injectable({providedIn: 'root'})
export class StockAdjustmentCategoryDescriptorStore
  extends createBaseStore<StockAdjustmentCategoryDescriptor>((entity) => entity.category)
  implements BaseStore<StockAdjustmentCategoryDescriptor> {

  readonly basePath = 'stock-adjustments/categories'
}
