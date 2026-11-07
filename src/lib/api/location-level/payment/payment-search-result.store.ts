import {Injectable} from '@angular/core'
import {createPaginatedBaseStore, PaginatedBaseStore} from '../../util/paginated-api/paginated-base.store'
import {PaymentRow} from './payment-search-result.model'
import {PaymentSummaryParams} from './payment-summary-params.model'

@Injectable({providedIn: 'root'})
export class PaymentSearchResultStore
  extends createPaginatedBaseStore<PaymentRow, PaymentSummaryParams>()
  implements PaginatedBaseStore<PaymentRow, PaymentSummaryParams> {

  readonly basePath = 'payments'
}
