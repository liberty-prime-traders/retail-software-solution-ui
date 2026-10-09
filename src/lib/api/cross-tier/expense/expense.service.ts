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
    this.patchApiRequestConfig({urlSuffix: 'standalone', upsertOnSuccess: true})
    return this.post(dto as any, this.notifyOnSuccess(callbacks))
  }

  createWages(dto: WageExpenseBatchRequest, callbacks?: ApiCallbacks<Expense>) {
    this.patchApiRequestConfig({urlSuffix: 'wages', upsertOnSuccess: true})
    return this.post(dto as any, this.notifyOnSuccess(callbacks))
  }

  createPayments(dtos: ExpensePaymentCreateRequest[], callbacks?: ApiCallbacks<Expense>) {
    this.patchApiRequestConfig({urlSuffix: 'payments', upsertOnSuccess: true})
    return this.post(dtos as any, this.notifyOnSuccess(callbacks))
  }

  voidPayment(dto: ExpensePaymentVoidRequest, callbacks?: ApiCallbacks<Expense>) {
    this.patchApiRequestConfig({urlSuffix: 'payments/void'})
    return this.post(dto as any, this.notifyOnSuccess(callbacks))
  }

  voidExpense(dto: ExpenseVoidRequest, callbacks?: ApiCallbacks<Expense>) {
    this.patchApiRequestConfig({urlSuffix: 'void'})
    return this.post(dto as any, this.notifyOnSuccess(callbacks))
  }

  private notifyOnSuccess(callbacks?: ApiCallbacks<Expense>): ApiCallbacks<Expense> {
    return this.applyInternalCallBacks({onSuccess: () => this.mutationCounter.update(count => count + 1)}, callbacks)
  }
}
