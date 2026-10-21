import {Injectable} from '@angular/core'
import {BaseService} from '../../util/base-api/base.service'
import {StockAdjustment} from './stock-adjustment.model'
import {StockAdjustmentStore} from './stock-adjustment.store'

@Injectable({providedIn: 'root'})
export class StockAdjustmentService extends BaseService<StockAdjustment> {
  constructor(protected override readonly store: StockAdjustmentStore) {
    super(store)
  }
}
