import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {StockTransferSummary} from './stock-transfer-summary.model'

@Injectable({providedIn: 'root'})
export class StockTransferSummaryStore
  extends createBaseStore<StockTransferSummary>((entity) => entity.referenceNumber!)
  implements BaseStore<StockTransferSummary> {

  readonly basePath = 'stock-transfers/summary'
}
