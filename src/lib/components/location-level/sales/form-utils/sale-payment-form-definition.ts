import {pattern, required, schema} from '@angular/forms/signals'
import {Patterns} from '../../../../utils/patterns'

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
    pattern(path.paymentMethodId, Patterns.UUID)

    required(
      path.paymentDate,
      {when: ({valueOf}) => !valueOf(path.useNowForDate)}
    )
  })
}
