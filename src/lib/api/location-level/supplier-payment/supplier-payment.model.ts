import {BaseModel} from '../../util/base-api/base.model'
import {PaymentStatus} from '../purchase/payment-status.enum'

export interface SupplierPayment extends BaseModel {
  purchaseReferenceNumber: string
  purchaseId: string
  deliveryReferenceNumber?: string
  paymentMethod: string
  supplier: string
  amount: number
  paymentDate: string
  notes?: string
  createdBy: string
  createdOn: string
  voidedReason?: string
  updatedPurchasePaymentStatus?: PaymentStatus
}

export interface SupplierPaymentCreateRequest {
  purchaseId: string
  deliveryId?: string
  paymentMethodId: string
  amount: number
  paymentDate: string
  notes?: string
}

export interface SupplierPaymentVoidRequest {
  supplierPaymentId: string
  reason: string
}
