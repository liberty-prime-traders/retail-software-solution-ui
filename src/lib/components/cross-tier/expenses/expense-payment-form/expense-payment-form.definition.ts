import {min, required, schema} from '@angular/forms/signals'
import {ExpensePaymentCreateRequest} from '../../../../api/cross-tier/expense/expense.model'
import {getToday, toLocaleDateString} from '../../../../utils/dates'

export namespace ExpensePaymentFormDefinition {
  export interface PaymentRowModel {
    amount: number | null
    paymentMethodId: string
    paymentReference: string
    paymentDate: Date | null
  }

  export const createDefaultRow = (amount: number | null = null): PaymentRowModel => ({
    amount,
    paymentMethodId: '',
    paymentReference: '',
    paymentDate: getToday()
  })

  export const rowSchema = schema<PaymentRowModel>((path) => {
    required(path.amount)
    min(path.amount, 0.01)
    required(path.paymentMethodId)
    required(path.paymentDate)
  })

  export const convertToBackendModel = (
    rows: PaymentRowModel[], expenseReference: string
  ): ExpensePaymentCreateRequest[] => rows.map(row => ({
    expenseReference,
    amount: row.amount!,
    settlement: {
      paymentMethodId: row.paymentMethodId,
      paymentReference: row.paymentReference || undefined,
      paymentDate: toLocaleDateString(row.paymentDate)
    }
  }))
}
