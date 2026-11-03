import {Injectable, signal} from '@angular/core'
import {ApiCallbacks} from '../../util/base-api/api-callbacks'
import {BaseService} from '../../util/base-api/base.service'
import {
  Expense,
  ExpensePaymentCreateRequest,
  ExpensePaymentVoidRequest,
  ExpenseVoidRequest,
  StandaloneExpenseBatchRequest,
  WageExpenseBatchRequest
} from './expense.model'
import {ExpenseActions} from './expense-actions'
import {ExpenseStore} from './expense.store'


@Injectable({providedIn: 'root'})
export class ExpenseService extends BaseService<Expense> implements ExpenseActions {
  constructor(protected override readonly store: ExpenseStore) {
    super(store)
  }

  private readonly mutationCounter = signal(0)
  readonly mutationCount = this.mutationCounter.asReadonly()

  createStandalone(dto: StandaloneExpenseBatchRequest, callbacks?: ApiCallbacks<Expense>) {
    return this.postRequest({body: dto as any, callbacks: this.notifyOnSuccess(callbacks), config: {urlSuffix: 'standalone', upsertOnSuccess: true}})
  }

  createWages(dto: WageExpenseBatchRequest, callbacks?: ApiCallbacks<Expense>) {
    return this.postRequest({body: dto as any, callbacks: this.notifyOnSuccess(callbacks), config: {urlSuffix: 'wages', upsertOnSuccess: true}})
  }

  createPayments(dtos: ExpensePaymentCreateRequest[], callbacks?: ApiCallbacks<Expense>) {
    return this.postRequest({body: dtos as any, callbacks: this.notifyOnSuccess(callbacks), config: {urlSuffix: 'payments', upsertOnSuccess: true}})
  }

  voidPayment(dto: ExpensePaymentVoidRequest, callbacks?: ApiCallbacks<Expense>) {
    return this.postRequest({body: dto as any, callbacks: this.notifyOnSuccess(callbacks), config: {urlSuffix: 'payments/void'}})
  }

  voidExpense(dto: ExpenseVoidRequest, callbacks?: ApiCallbacks<Expense>) {
    return this.postRequest({body: dto as any, callbacks: this.notifyOnSuccess(callbacks), config: {urlSuffix: 'void'}})
  }

  private notifyOnSuccess(callbacks?: ApiCallbacks<Expense>): ApiCallbacks<Expense> {
    return this.applyInternalCallBacks({onSuccess: () => this.mutationCounter.update(count => count + 1)}, callbacks)
  }
}
