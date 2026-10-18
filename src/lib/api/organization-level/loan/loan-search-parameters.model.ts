import {LoanStatus} from './loan-status.enum'

export interface LoanSearchParameters {
  createdFrom?: string
  createdBefore?: string
  lenderContactReferences?: string[]
  statuses?: LoanStatus[]
  loanDateFrom?: string
  loanDateBefore?: string
  references?: string[]
}
