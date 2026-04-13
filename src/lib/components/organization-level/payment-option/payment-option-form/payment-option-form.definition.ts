import {required, schema} from '@angular/forms/signals'
import {PaymentOption} from '../../../../api/organization-level/payment-option/payment-option.model.'

export namespace PaymentOptionFormDefinition {

  export interface PaymentOptionFormModel {
    id: string
    name: string
    description: string
    accountCode: string
  }

  export const fieldMap = new Map<keyof PaymentOptionFormModel, string>([
    ['name', 'Name'],
    ['description', 'Description'],
    ['accountCode', 'Account Code']
  ])

  export const defaultFormModel: PaymentOptionFormModel = {
    id: '',
    name: '',
    description: '',
    accountCode: ''
  }

  export const formSchema = schema<PaymentOptionFormModel>((path) => {
    required(path.name)
  })

  export const convertToFormModel = (entity?: PaymentOption): PaymentOptionFormModel => ({
    id: entity?.id as string ?? '',
    name: entity?.name ?? '',
    description: entity?.description ?? '',
    accountCode: entity?.accountCode ?? ''
  })

  export const convertToBackendModel = (formValue: PaymentOptionFormModel): Partial<PaymentOption> => ({
    id: formValue.id,
    name: formValue.name,
    description: formValue.description,
    accountCode: formValue.accountCode || undefined
  })
}
