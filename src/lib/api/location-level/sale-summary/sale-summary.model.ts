import {BaseModel} from '../../util/base-api/base.model'
import {PaymentStatus} from '../purchase/payment-status.enum'
import {SaleStatus} from './sale-status.enum'

export interface SaleSummary extends BaseModel {
  contactName: string
  soldBy: string
  dateSold: string
  status: SaleStatus
  paymentStatus: PaymentStatus
  subtotal: number
  grandTotal: number
  totalPaid: number
}
