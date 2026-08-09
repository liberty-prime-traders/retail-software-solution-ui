import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {StockTransferResponse} from './stock-transfer-response.model'

@Injectable({providedIn: 'root'})
export class StockTransferStore
  extends createBaseStore<StockTransferResponse>((entity) => entity.summary.referenceNumber!)
  implements BaseStore<StockTransferResponse> {

  readonly basePath = 'stock-transfers'
}
