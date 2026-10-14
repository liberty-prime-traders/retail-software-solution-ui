import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {StockMovementReason} from './stock-movement-reason.model'

@Injectable({providedIn: 'root'})
export class StockMovementReasonStore extends createBaseStore<StockMovementReason>()
  implements BaseStore<StockMovementReason> {
  readonly basePath = 'stock-movement-reasons'
}
