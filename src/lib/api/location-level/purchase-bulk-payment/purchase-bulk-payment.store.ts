import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {PurchaseBulkPaymentLine} from './purchase-bulk-payment.model'

@Injectable({providedIn: 'root'})
export class PurchaseBulkPaymentStore
  extends createBaseStore<PurchaseBulkPaymentLine>()
  implements BaseStore<PurchaseBulkPaymentLine> {

  readonly basePath = 'purchases'
}
