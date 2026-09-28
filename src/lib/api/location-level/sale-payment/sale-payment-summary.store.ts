import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {SalePaymentSummary} from './sale-payment-summary.model'

@Injectable({providedIn: 'root'})
export class SalePaymentSummaryStore extends createBaseStore<SalePaymentSummary>()
  implements BaseStore<SalePaymentSummary>{

  readonly basePath = 'sale-payments/summary'
}
