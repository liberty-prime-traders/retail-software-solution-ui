import {BaseModel} from '../../util/base-api/base.model'
import {PaymentStatus} from '../purchase/payment-status.enum'
import {PurchaseStatus} from '../purchase/purchase-status.enum'

export interface PurchaseBulkPaymentLine extends BaseModel {
  id: string
  referenceNumber: string
  purchaseStatus: PurchaseStatus
  dateOrdered?: string
  orderedTotal: number
  paymentCeiling: number
  paidTotal: number
  payable: number
  paymentStatus: PaymentStatus
  appliedAmount: number
  supplierPaymentId?: string
  paymentReferenceNumber?: string
}

export interface PurchaseBulkPaymentSearchRequest {
  supplierId: string
  orderedFrom: string
  orderedBefore: string
}

export interface PurchaseBulkPaymentCreateRequest {
  supplierId: string
  purchaseIds: string[]
  amount: number
  paymentMethodId: string
  paymentDate: string
  notes?: string
}
