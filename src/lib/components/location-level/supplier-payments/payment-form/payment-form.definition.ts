import {max, min, required, schema} from '@angular/forms/signals'
import {SupplierPaymentCreateRequest} from '../../../../api/location-level/supplier-payment/supplier-payment.model'
import {ZonedDatesService} from '../../../../utils/services/zoned-dates.service'

export namespace PaymentFormDefinition {
  export interface PaymentFormModel {
    deliveryId: string | null
    paymentMethodId: string
    amount: number | null
    paymentDate: Date | null
    notes: string
    purchaseArrears: number
  }

  export const fieldMap = new Map<keyof PaymentFormModel, string>([
    ['paymentDate', 'Payment Date'],
    ['paymentMethodId', 'Payment Method'],
    ['amount', 'Amount'],
    ['deliveryId', 'Delivery'],
    ['notes', 'Notes']
  ])

  export const defaultPaymentFormModel: PaymentFormModel = {
    deliveryId: null,
    paymentMethodId: '',
    purchaseArrears: 0,
    amount: null,
    paymentDate: null,
    notes: ''
  }

  export const paymentFormSchema = schema<PaymentFormModel>((path) => {
    required(path.paymentMethodId)
    required(path.paymentDate)
    required(path.amount)
    min(path.amount, 0.01)
    max(path.amount, ({valueOf}) => valueOf(path.purchaseArrears))
  })

  export const convertToBackendModel = (
    formValue: PaymentFormModel, purchaseId: string, zonedDatesService: ZonedDatesService
  )
    : SupplierPaymentCreateRequest => ({
      purchaseId,
      deliveryId: formValue.deliveryId ?? undefined,
      paymentMethodId: formValue.paymentMethodId,
      amount: formValue.amount!,
      paymentDate: zonedDatesService.toZonedISOString(formValue.paymentDate),
      notes: formValue.notes || undefined
    })
}
