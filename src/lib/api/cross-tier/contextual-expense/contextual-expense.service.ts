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
import {ExpenseActions} from '../expense/expense-actions'
import {ContextualExpenseStore} from './contextual-expense.store'

@Injectable({providedIn: 'root'})
export class ContextualExpenseService extends MultimapBaseService<Expense> implements ExpenseActions {
  protected override keyPath: keyof Expense = 'sourceReference'

  constructor(protected override readonly store: ContextualExpenseStore) {
    super(store)
  }

  createForPurchase(dto: PurchaseExpenseBatchRequest, callbacks?: ApiCallbacks<Expense>) {
    return this.postRequest({body: dto as any, callbacks, config: {urlSuffix: 'purchase'}})
  }

  createPayments(dtos: ExpensePaymentCreateRequest[], callbacks?: ApiCallbacks<Expense>) {
    return this.postRequest({body: dtos as any, callbacks, config: {urlSuffix: 'payments', upsertOnSuccess: true}})
  }

  voidPayment(dto: ExpensePaymentVoidRequest, callbacks?: ApiCallbacks<Expense>) {
    return this.postRequest({body: dto as any, callbacks, config: {urlSuffix: 'payments/void'}})
  }

  voidExpense(dto: ExpenseVoidRequest, callbacks?: ApiCallbacks<Expense>) {
    return this.postRequest({body: dto as any, callbacks, config: {urlSuffix: 'void'}})
  }

  override appendHttpParams(httpParams: HttpParams, params: ExpenseBySourceRequest): HttpParams {
    return httpParams
      .setNonNull(String(this.keyPath), params.sourceReference)
      .setNonNull('sourceType', params.sourceType)
  }

  fetchForSource(params: ExpenseBySourceRequest) {
    return this.refetch(params, undefined, {urlSuffix: 'by-source'})
  }
}
