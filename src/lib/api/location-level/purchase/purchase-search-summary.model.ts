import {BaseModel} from '../../util/base-api/base.model'
import {PaymentStatus} from './payment-status.enum'

export interface PurchasePaymentStatusSummary {
  paymentStatus: PaymentStatus
  purchaseCount: number
  totalOrdered: number
  totalPaid: number
  totalOutstanding: number
}

export interface PurchaseSupplierSummary {
  supplierId: string
  supplierName: string
  purchaseCount: number
  totalOrdered: number
  totalPaid: number
  totalOutstanding: number
}

export interface PurchaseSearchSummary extends BaseModel {
  purchaseCount: number
  totalOrdered: number
  totalPaid: number
  totalOutstanding: number
  byPaymentStatus: PurchasePaymentStatusSummary[]
  bySupplier?: PurchaseSupplierSummary[]
}
