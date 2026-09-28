import {Injectable} from '@angular/core'
import {createPaginatedBaseStore, PaginatedBaseStore} from '../../util/paginated-api/paginated-base.store'
import {SalePaymentSearchResult} from './sale-payment-search-result.model'
import {SalePaymentSummaryParams} from './sale-payment-summary-params.model'

@Injectable({providedIn: 'root'})
export class SalePaymentSearchResultStore
  extends createPaginatedBaseStore<SalePaymentSearchResult, SalePaymentSummaryParams>()
  implements PaginatedBaseStore<SalePaymentSearchResult, SalePaymentSummaryParams> {

  readonly basePath = 'sale-payments'
}
