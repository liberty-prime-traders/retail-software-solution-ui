import {PaymentVoidStatus} from './payment-void-status.enum'
import {PaymentType} from './payment-type.enum'

export interface PaymentSummaryParams {
  types?: PaymentType[]
  recordedFrom?: string
  recordedBefore?: string
  paymentDateFrom?: string
  paymentDateBefore?: string
  contactIds?: string[]
  paymentMethodIds?: string[]
  statuses?: PaymentVoidStatus[]
  minAmount?: number
  maxAmount?: number
  referenceNumbersByType?: Partial<Record<PaymentType, string[]>>
}
