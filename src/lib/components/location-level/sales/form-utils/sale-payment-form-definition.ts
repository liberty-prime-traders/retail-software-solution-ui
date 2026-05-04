import {applyWhen, required, schema} from '@angular/forms/signals'

export namespace SalePaymentFormDefinition {

  export interface SalePaymentFormModel {
    paymentMethodId: string
    amount: number | null
    reference: string
    useNowForDate:boolean
    paymentDate: Date | null
  }

  export const createInitial : SalePaymentFormModel ={
    paymentMethodId: '',
    amount: null,
    reference: '',
    paymentDate: null,
    useNowForDate: true
  }

  export const salePaymentFormSchema = schema<SalePaymentFormModel>((path) => {
    required(path.paymentMethodId)
    required(path.amount)

    applyWhen(
      path.paymentDate,
      ({ valueOf }) => !valueOf(path.useNowForDate),
      (paymentDatePath) => { required(paymentDatePath) }
    )
  })
}
