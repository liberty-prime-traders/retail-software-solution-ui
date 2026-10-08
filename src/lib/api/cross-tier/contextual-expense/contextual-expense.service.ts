import {HttpParams} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {ApiCallbacks} from '../../util/base-api/api-callbacks'
import {MultimapBaseService} from '../../util/base-api/multimap-base.service'
import {
  Expense,
  ExpenseBySourceRequest,
  ExpensePaymentCreateRequest,
  ExpensePaymentVoidRequest,
  ExpenseVoidRequest,
  PurchaseExpenseBatchRequest
} from '../expense/expense.model'
import {ContextualExpenseStore} from './contextual-expense.store'

@Injectable({providedIn: 'root'})
export class ContextualExpenseService extends MultimapBaseService<Expense> {
  protected override keyPath: keyof Expense = 'sourceReference'

  constructor(protected override readonly store: ContextualExpenseStore) {
    super(store)
  }

  createForPurchase(dto: PurchaseExpenseBatchRequest, callbacks?: ApiCallbacks<Expense>) {
    this.patchApiRequestConfig({urlSuffix: 'purchase'})
    return this.post(dto as any, callbacks)
  }

  createPayments(dtos: ExpensePaymentCreateRequest[], callbacks?: ApiCallbacks<Expense>) {
    this.patchApiRequestConfig({urlSuffix: 'payments'})
    return this.post(dtos as any, callbacks)
  }

  voidPayment(dto: ExpensePaymentVoidRequest, callbacks?: ApiCallbacks<Expense>) {
    this.patchApiRequestConfig({urlSuffix: 'payments/void'})
    return this.post(dto as any, callbacks)
  }

  voidExpense(dto: ExpenseVoidRequest, callbacks?: ApiCallbacks<Expense>) {
    this.patchApiRequestConfig({urlSuffix: 'void'})
    return this.post(dto as any, callbacks)
  }

  override appendHttpParams(httpParams: HttpParams, params: ExpenseBySourceRequest): HttpParams {
    return httpParams
      .setNonNull(String(this.keyPath), params.sourceReference)
      .setNonNull('sourceType', params.sourceType)
  }

  fetchForSource(params: ExpenseBySourceRequest) {
    this.patchApiRequestConfig({urlSuffix: 'by-source'})
    return this.refetch(params)
  }
}
