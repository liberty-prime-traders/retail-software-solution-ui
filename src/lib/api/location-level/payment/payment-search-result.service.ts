import {Injectable} from '@angular/core'
import {PaginatedBaseService} from '../../util/paginated-api/paginated-base.service'
import {PaymentRow} from './payment-search-result.model'
import {PaymentSearchResultStore} from './payment-search-result.store'
import {PaymentSummaryParams} from './payment-summary-params.model'

@Injectable({providedIn: 'root'})
export class PaymentSearchResultService extends PaginatedBaseService<PaymentRow, PaymentSummaryParams> {
  protected override readonly defaultCursor = ''

  constructor(protected override readonly store: PaymentSearchResultStore) {
    super(store)
  }
}
