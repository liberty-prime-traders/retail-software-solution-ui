import {SalePaymentStatus} from './sale-payment-status.enum'

export interface SalePaymentSummaryParams {
  recordedFrom?: string
  recordedBefore?: string
  paymentDateFrom?: string
  paymentDateBefore?: string
  contactIds?: string[]
  paymentMethodIds?: string[]
  statuses?: SalePaymentStatus[]
  minAmount?: number
  maxAmount?: number
  saleReferenceNumbers?: string[]
}
