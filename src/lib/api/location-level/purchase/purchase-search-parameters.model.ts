import {PaymentStatus} from './payment-status.enum'
import {PurchaseStatus} from './purchase-status.enum'

export interface PurchaseSearchParameters {
  recordedFrom?: string
  recordedBefore?: string
  purchaseDateFrom?: string
  purchaseDateBefore?: string
  supplierIds?: string[]
  purchaseStatuses?: PurchaseStatus[]
  paymentStatuses?: PaymentStatus[]
  minAmount?: number
  maxAmount?: number
  purchaseReferenceNumbers?: string[]
}
