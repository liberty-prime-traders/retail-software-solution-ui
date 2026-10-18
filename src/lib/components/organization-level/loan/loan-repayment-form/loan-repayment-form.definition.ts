import {min, required, schema, validate} from '@angular/forms/signals'
import {LoanRepaymentCreateRequest} from '../../../../api/organization-level/loan/loan.model'
import {getToday, toLocaleDateString} from '../../../../utils/dates'

export namespace LoanRepaymentFormDefinition {
  export interface LoanRepaymentFormModel {
    assetAccountCode: string
    amount: number | null
    repaymentDate: Date | null
    note: string
  }

  export const fieldMap = new Map<keyof LoanRepaymentFormModel, string>(
    [
      ['assetAccountCode', 'Paid From Account'],
      ['amount', 'Amount'],
      ['repaymentDate', 'Date'],
      ['note', 'Note']
    ]
  )

  export const createDefaultFormModel = (): LoanRepaymentFormModel => ({
    assetAccountCode: '',
    amount: null,
    repaymentDate: getToday(),
    note: ''
  })

  export const createFormSchema = (outstanding: () => number) => schema<LoanRepaymentFormModel>((path) => {
    required(path.assetAccountCode)
    required(path.amount)
    min(path.amount, 0.01)
    validate(path.amount, ({value}) => {
      const amount = value()
      return amount && amount > outstanding()
        ? {kind: 'exceedsOutstanding', message: 'Amount cannot exceed the outstanding balance'}
        : null
    })
    required(path.repaymentDate)
  })

  export const convertToRequest = (loanId: string, formValue: LoanRepaymentFormModel): LoanRepaymentCreateRequest => ({
    loanId,
    assetAccountCode: formValue.assetAccountCode,
    amount: formValue.amount!,
    repaymentDate: toLocaleDateString(formValue.repaymentDate),
    note: formValue.note || undefined
  })
}
