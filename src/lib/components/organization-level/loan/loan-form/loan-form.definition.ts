import {min, required, schema} from '@angular/forms/signals'
import {LoanCreateRequest} from '../../../../api/organization-level/loan/loan.model'
import {getToday, toLocaleDateString} from '../../../../utils/dates'

export namespace LoanFormDefinition {
  export interface LoanFormModel {
    lenderContactReference: string
    assetAccountCode: string
    amount: number | null
    loanDate: Date | null
    note: string
  }

  export const fieldMap = new Map<keyof LoanFormModel, string>(
    [
      ['lenderContactReference', 'Lender'],
      ['assetAccountCode', 'Received Into Account'],
      ['amount', 'Amount'],
      ['loanDate', 'Date'],
      ['note', 'Note']
    ]
  )

  export const createDefaultFormModel = (): LoanFormModel => ({
    lenderContactReference: '',
    assetAccountCode: '',
    amount: null,
    loanDate: getToday(),
    note: ''
  })

  export const formSchema = schema<LoanFormModel>((path) => {
    required(path.lenderContactReference)
    required(path.assetAccountCode)
    required(path.amount)
    min(path.amount, 0.01)
    required(path.loanDate)
  })

  export const convertToRequest = (formValue: LoanFormModel): LoanCreateRequest => ({
    lenderContactReference: formValue.lenderContactReference,
    assetAccountCode: formValue.assetAccountCode,
    amount: formValue.amount!,
    loanDate: toLocaleDateString(formValue.loanDate),
    note: formValue.note || undefined
  })
}
