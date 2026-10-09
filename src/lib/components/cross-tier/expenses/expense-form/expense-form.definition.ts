import {min, required, schema} from '@angular/forms/signals'
import {
  PurchaseExpenseBatchRequest,
  PurchaseExpenseRowRequest
} from '../../../../api/cross-tier/expense/expense.model'
import {getToday, getTodayStr, toLocaleDateString} from '../../../../utils/dates'

export namespace ExpenseFormDefinition {
  export interface ExpenseRowModel {
    payeeContactId: string | null
    expenseTypeId: string
    amount: number | null
    description: string
    expenseDate: Date | null
    payNow: boolean
    addNote: boolean
    paymentMethodId: string
    paymentReference: string
    paymentDate: Date | null
  }

  export const createDefaultRow = (payeeContactId: string | null = null): ExpenseRowModel => ({
    payeeContactId,
    expenseTypeId: '',
    amount: null,
    description: '',
    expenseDate: getToday(),
    payNow: false,
    addNote: false,
    paymentMethodId: '',
    paymentReference: '',
    paymentDate: getToday()
  })

  export const rowSchema = schema<ExpenseRowModel>((path) => {
    required(path.expenseTypeId)
    required(path.amount)
    min(path.amount, 0.01)
    required(path.expenseDate)
    required(path.paymentMethodId, {when: ({valueOf}) => valueOf(path.payNow)})
    required(path.paymentDate, {when: ({valueOf}) => valueOf(path.payNow)})
  })

  const convertRow = (row: ExpenseRowModel): PurchaseExpenseRowRequest => ({
    payeeContactId: row.payeeContactId || undefined,
    expenseTypeId: row.expenseTypeId,
    amount: row.amount!,
    description: row.description || undefined,
    expenseDateOverride: toLocaleDateString(row.expenseDate),
    settlement: row.payNow
      ? {
        paymentMethodId: row.paymentMethodId,
        paymentReference: row.paymentReference || undefined,
        paymentDate: toLocaleDateString(row.paymentDate)
      }
      : undefined
  })

  export const convertToBackendModel = (
    rows: ExpenseRowModel[], purchaseReference: string
  ): PurchaseExpenseBatchRequest => ({
    purchaseReference,
    expenseDate: getTodayStr(),
    rows: rows.map(convertRow)
  })
}
