import {required, schema} from '@angular/forms/signals'
import {PaymentOption} from '../../../../api/organization-level/payment-option/payment-option.model.'

export namespace PaymentOptionFormDefinition {
  export interface PaymentOptionFormModel {
    id: string
    name: string
    description: string
  }

  export const fieldMap = new Map<keyof PaymentOptionFormModel, string>(
    [
      ['name', 'Name'],
      ['description', 'Description']
    ]
  )

  export const defaultPaymentOptionFormModel: PaymentOptionFormModel = {
    id: '',
    name: '',
    description: ''
  }

  export const paymentOptionFormSchema = schema<PaymentOptionFormModel>(path => {
    required(path.name)
  })

  export const convertToFormModel = (paymentOption?: PaymentOption): PaymentOptionFormModel => ({
    id: paymentOption?.id as string ?? '',
    name: paymentOption?.name ?? '',
    description: paymentOption?.description ?? ''
  })

  export const convertToBackendModel = (
    formValue: PaymentOptionFormModel
  ): Partial<PaymentOption> => ({
    id: formValue.id || undefined,
    name: formValue.name,
    description: formValue.description
  })
}
