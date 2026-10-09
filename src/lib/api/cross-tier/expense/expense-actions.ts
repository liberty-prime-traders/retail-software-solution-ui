import {InjectionToken} from '@angular/core'
import {ApiCallbacks} from '../../util/base-api/api-callbacks'
import {BaseService} from '../../util/base-api/base.service'
import {Expense, ExpensePaymentCreateRequest, ExpensePaymentVoidRequest, ExpenseVoidRequest} from './expense.model'

export interface ExpenseActions extends BaseService<Expense> {
  createPayments(dtos: ExpensePaymentCreateRequest[], callbacks?: ApiCallbacks<Expense>): unknown
  voidPayment(dto: ExpensePaymentVoidRequest, callbacks?: ApiCallbacks<Expense>): unknown
  voidExpense(dto: ExpenseVoidRequest, callbacks?: ApiCallbacks<Expense>): unknown
}

export const EXPENSE_ACTIONS = new InjectionToken<ExpenseActions>('EXPENSE_ACTIONS')
