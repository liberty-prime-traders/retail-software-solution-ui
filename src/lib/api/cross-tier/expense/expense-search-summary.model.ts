import {BaseModel} from '../../util/base-api/base.model'
import {ExpenseSummaryBucket} from './expense-summary-bucket.enum'

export interface ExpenseBucketSummary {
  bucket: ExpenseSummaryBucket
  expenseCount: number
  amountTotal: number
  paidTotal: number
  outstandingTotal: number
}

export interface ExpenseTypeSummary {
  expenseTypeId: string
  expenseTypeName: string
  expenseCount: number
  amountTotal: number
  paidTotal: number
  outstandingTotal: number
  voidedCount: number
  voidedAmountTotal: number
}

export interface ExpenseSearchSummary extends BaseModel {
  byStatus: ExpenseBucketSummary[]
  byExpenseType: ExpenseTypeSummary[]
  expenseCount: number
  amountTotal: number
  paidTotal: number
  outstandingTotal: number
  voidedCount: number
  voidedAmountTotal: number
}
