import {BaseModel} from '../../util/base-api/base.model'
import {LoanStatus} from './loan-status.enum'

export interface LoanAccount {
  code: string
  label: string
}

export interface LoanLender {
  contactReference: string
  displayName: string
}

export interface LoanVoid {
  voidDate: string
  reason?: string
  voidedBy: string
}

export interface LoanRepayment {
  id: string
  referenceNumber: string
  assetAccount: LoanAccount
  amount: number
  repaymentDate: string
  note?: string
  createdOn: string
  createdBy: string
  void?: LoanVoid
}

export interface Loan extends BaseModel {
  lender: LoanLender
  assetAccount: LoanAccount
  amount: number
  loanDate: string
  note?: string
  amountRepaid: number
  outstanding: number
  status: LoanStatus
  createdOn: string
  createdBy: string
  void?: LoanVoid
  repayments: LoanRepayment[]
}

export interface LoanCreateRequest {
  lenderContactReference: string
  assetAccountCode: string
  amount: number
  loanDate: string
  note?: string
}

export interface LoanRepaymentCreateRequest {
  loanId: string
  assetAccountCode: string
  amount: number
  repaymentDate: string
  note?: string
}

export interface LoanVoidRequest {
  loanId: string
  reason?: string
}

export interface LoanRepaymentVoidRequest {
  repaymentId: string
  reason?: string
}

export type LoanRequest =
  LoanCreateRequest
  | LoanRepaymentCreateRequest
  | LoanVoidRequest
  | LoanRepaymentVoidRequest
