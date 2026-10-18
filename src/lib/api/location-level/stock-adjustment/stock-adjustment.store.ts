import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {StockAdjustment} from './stock-adjustment.model'

@Injectable({providedIn: 'root'})
export class StockAdjustmentStore
  extends createBaseStore<StockAdjustment>((entity) => entity.referenceNumber!)
  implements BaseStore<StockAdjustment> {

  readonly basePath = 'stock-adjustments'
}
