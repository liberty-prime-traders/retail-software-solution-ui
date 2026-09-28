import {Injectable} from '@angular/core'
import {PaginatedBaseService} from '../../util/paginated-api/paginated-base.service'
import {SalePaymentSearchResult} from './sale-payment-search-result.model'
import {SalePaymentSearchResultStore} from './sale-payment-search-result.store'
import {SalePaymentSummaryParams} from './sale-payment-summary-params.model'

@Injectable({providedIn: 'root'})
export class SalePaymentSearchResultService extends PaginatedBaseService<SalePaymentSearchResult, SalePaymentSummaryParams> {
  protected override readonly defaultCursor = ''

  constructor(protected override readonly store: SalePaymentSearchResultStore) {
    super(store)
  }
}
