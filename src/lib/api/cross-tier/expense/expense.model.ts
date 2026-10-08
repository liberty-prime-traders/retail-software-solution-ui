import {BaseModel} from '../../util/base-api/base.model'
import {PaymentStatus} from '../../location-level/purchase/payment-status.enum'
import {ExpenseSourceType} from './expense-source-type.enum'

export interface ExpensePayment {
  reference: string
  amount: number
  paymentMethodName: string
  providerReference?: string
  paymentDate: string
  voided: boolean
  voidReason?: string
  voidedOn?: string
  createdOn: string
}

export interface Expense extends BaseModel {
  reference: string
  expenseTypeName: string
  payeeContactId: string
  payeeDisplayName: string
  amount: number
  expenseDate: string
  description?: string
  sourceType: ExpenseSourceType
  sourceReference?: string
  batchReference: string
  batchDescription: string
  status: PaymentStatus
  amountPaid: number
  balanceRemaining: number
  voided: boolean
  voidReason?: string
  createdOn: string
  createdBy: string
  payments: ExpensePayment[]
}

export interface PaymentInstruction {
  paymentMethodId: string
  paymentReference?: string
  paymentDate?: string
}

export interface PurchaseExpenseRowRequest {
  payeeContactId?: string
  expenseTypeId: string
  amount: number
  description?: string
  expenseDateOverride: string
  settlement?: PaymentInstruction
}

export interface PurchaseExpenseBatchRequest {
  purchaseReference: string
  expenseDate: string
  rows: PurchaseExpenseRowRequest[]
}

export interface ExpenseBySourceRequest {
  sourceType: ExpenseSourceType
  sourceReference: string
}

export interface ExpensePaymentCreateRequest {
  expenseReference: string
  settlement: PaymentInstruction
  amount: number
}

export interface ExpensePaymentVoidRequest {
  paymentReference: string
  reason: string
}

export interface ExpenseVoidRequest {
  expenseReference: string
  reason: string
}
