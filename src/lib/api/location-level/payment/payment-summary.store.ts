import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {PaymentSummary} from './payment-summary.model'

@Injectable({providedIn: 'root'})
export class PaymentSummaryStore extends createBaseStore<PaymentSummary>()
  implements BaseStore<PaymentSummary>{

  readonly basePath = 'payments/summary'
}
