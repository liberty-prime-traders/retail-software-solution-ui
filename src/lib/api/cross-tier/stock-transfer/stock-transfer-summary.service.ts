import {Injectable} from '@angular/core'
import {BaseService} from '../../util/base-api/base.service'
import {StockTransferSummary} from './stock-transfer-summary.model'
import {StockTransferSummaryStore} from './stock-transfer-summary.store'

@Injectable({providedIn: 'root'})
export class StockTransferSummaryService extends BaseService<StockTransferSummary> {

  constructor(protected override readonly store: StockTransferSummaryStore) {
    super(store)
  }

}
