import {min, required, schema, validate} from '@angular/forms/signals'
import {
  FundMovementCapitalRequest,
  FundMovementDrawRequest,
  FundMovementTransferRequest
} from '../../../../api/organization-level/fund-transfer/fund-movement.model'
import {FundMovementType} from '../../../../api/organization-level/fund-transfer/fund-movement-type.enum'
import {getToday, toLocaleDateString} from '../../../../utils/dates'

export namespace FundTransferFormDefinition {
  export interface FundTransferFormModel {
    type: FundMovementType
    fromAccountCode: string
    toAccountCode: string
    accountCode: string
    amount: number | null
    movementDate: Date | null
    note: string
  }

  export const fieldMap = new Map<keyof FundTransferFormModel, string>(
    [
      ['type', 'Type'],
      ['fromAccountCode', 'From Account'],
      ['toAccountCode', 'To Account'],
      ['accountCode', 'Account'],
      ['amount', 'Amount'],
      ['movementDate', 'Date'],
      ['note', 'Note']
    ]
  )

  export const createDefaultFormModel = (): FundTransferFormModel => ({
    type: FundMovementType.TRANSFER_BETWEEN_ACCOUNTS,
    fromAccountCode: '',
    toAccountCode: '',
    accountCode: '',
    amount: null,
    movementDate: getToday(),
    note: ''
  })

  export const formSchema = schema<FundTransferFormModel>((path) => {
    required(path.type)
    required(path.fromAccountCode, {when: ({valueOf}) => valueOf(path.type) === FundMovementType.TRANSFER_BETWEEN_ACCOUNTS})
    required(path.toAccountCode, {when: ({valueOf}) => valueOf(path.type) === FundMovementType.TRANSFER_BETWEEN_ACCOUNTS})
    required(path.accountCode, {when: ({valueOf}) => valueOf(path.type) !== FundMovementType.TRANSFER_BETWEEN_ACCOUNTS})
    required(path.amount)
    min(path.amount, 0.01)
    required(path.movementDate)
    validate(path.movementDate, ({value}) => {
      const movementDate = value()
      return movementDate && movementDate > getToday()
        ? {kind: 'futureDate', message: 'Date cannot be in the future'}
        : null
    })
  })

  export const convertToTransferRequest = (formValue: FundTransferFormModel): FundMovementTransferRequest => ({
    fromAccountCode: formValue.fromAccountCode,
    toAccountCode: formValue.toAccountCode,
    amount: formValue.amount!,
    movementDate: toLocaleDateString(formValue.movementDate),
    note: formValue.note || undefined
  })

  export const convertToCapitalRequest = (formValue: FundTransferFormModel): FundMovementCapitalRequest => ({
    accountCode: formValue.accountCode,
    amount: formValue.amount!,
    movementDate: toLocaleDateString(formValue.movementDate),
    note: formValue.note || undefined
  })

  export const convertToDrawRequest = (formValue: FundTransferFormModel): FundMovementDrawRequest =>
    convertToCapitalRequest(formValue)
}
