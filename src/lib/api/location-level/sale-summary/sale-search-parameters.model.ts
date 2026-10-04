import {PaymentStatus} from '../purchase/payment-status.enum'
import {SaleStatus} from './sale-status.enum'

export interface SaleSearchParameters {
  createdFrom?: string
  createdBefore?: string
  contactIds?: string[]
  soldByUserIds?: string[]
  saleStatuses?: SaleStatus[]
  paymentStatuses?: PaymentStatus[]
  minReceivableTotal?: number
  maxReceivableTotal?: number
  minDiscountTotal?: number
  maxDiscountTotal?: number
  saleReferenceNumbers?: string[]
}
