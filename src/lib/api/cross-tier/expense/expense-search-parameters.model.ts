import {PaymentStatus} from '../../location-level/purchase/payment-status.enum'

export interface ExpenseSearchParameters {
  createdFrom?: string
  createdBefore?: string
  expenseDateFrom?: string
  expenseDateBefore?: string
  payeeContactIds?: string[]
  expenseTypeIds?: string[]
  sourceReferences?: string[]
  paymentMethodIds?: string[]
  paymentStatuses?: PaymentStatus[]
  voided?: boolean
  minAmount?: number
  maxAmount?: number
}
