import {BaseModel} from '../../util/base-api/base.model'
import {PaymentStatus} from '../purchase/payment-status.enum'

export interface SalePayment extends BaseModel{
  fakeId?: number
  saleId: string,
  paymentMethodId: string,
  paymentMethodName: string,
  amount: number,
  reference?: string,
  paymentDate?: string
  paymentDateFormModel?: Date
  updatedSalePaymentStatus?: PaymentStatus
}
