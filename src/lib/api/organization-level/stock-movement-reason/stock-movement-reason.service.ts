import {Injectable} from '@angular/core'
import {BaseService} from '../../util/base-api/base.service'
import {StockMovementReason} from './stock-movement-reason.model'
import {StockMovementReasonStore} from './stock-movement-reason.store'

@Injectable({providedIn: 'root'})
export class StockMovementReasonService extends BaseService<StockMovementReason> {
  constructor(protected override readonly store: StockMovementReasonStore) {
    super(store)
  }
}
