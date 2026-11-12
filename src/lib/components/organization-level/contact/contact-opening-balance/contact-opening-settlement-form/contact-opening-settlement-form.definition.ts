import {max, maxDate, min, required, schema} from '@angular/forms/signals'
import {
  ContactSubledgerDirection
} from '../../../../../api/organization-level/contact-opening-balance/contact-subledger-direction.enum'
import {
  ContactOpeningSettlementCreateRequest
} from '../../../../../api/organization-level/contact-opening-settlement/contact-opening-settlement.model'
import {getToday, toLocaleDateString} from '../../../../../utils/dates'

export namespace ContactOpeningSettlementFormDefinition {
  export interface FormModel {
    subledgerDirection: ContactSubledgerDirection | null
    paymentMethodId: string
    amount: number | null
    settlementDate: Date | null
    note: string
  }

  export const fieldMap = new Map<keyof FormModel, string>([
    ['subledgerDirection', 'Settling'],
    ['paymentMethodId', 'Payment Method'],
    ['amount', 'Amount'],
    ['settlementDate', 'Date'],
    ['note', 'Note']
  ])

  export const createDefaultFormModel = (subledgerDirection: ContactSubledgerDirection | null): FormModel => ({
    subledgerDirection,
    paymentMethodId: '',
    amount: null,
    settlementDate: getToday(),
    note: ''
  })

  export const createFormSchema = (
    outstandingFor: (subledgerDirection: ContactSubledgerDirection | null) => number
  ) => schema<FormModel>((path) => {
    required(path.subledgerDirection)
    required(path.paymentMethodId)
    required(path.amount)
    min(path.amount, 0.01)
    max(
      path.amount,
      ({valueOf}) => outstandingFor(valueOf(path.subledgerDirection)),
      {
        message: 'Amount cannot exceed the outstanding opening balance',
        when: ({valueOf}) => valueOf(path.subledgerDirection) !== null
      }
    )
    required(path.settlementDate)
    maxDate(path.settlementDate, getToday, {message: 'Settlement date cannot be in the future'})
  })

  export const convertToRequest = (
    contactId: string,
    formValue: FormModel
  ): ContactOpeningSettlementCreateRequest => ({
    contactId,
    subledgerDirection: formValue.subledgerDirection!,
    paymentMethodId: formValue.paymentMethodId,
    amount: formValue.amount!,
    settlementDate: toLocaleDateString(formValue.settlementDate),
    note: formValue.note || undefined
  })
}
