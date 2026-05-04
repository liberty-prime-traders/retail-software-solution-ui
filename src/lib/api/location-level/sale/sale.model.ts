import {BaseModel} from '../../util/base-api/base.model'
import {LocationProduct} from '../location-product/location-product.model'
import {PaymentStatus} from '../purchase/payment-status.enum'
import {SaleStatus} from './sale-status.enum'

export interface Sale extends BaseModel {
  contactId?: string
  contactName?: string
  walkInCustomer: boolean
  soldBy: string
  soldById: string
  dateSold: string
  notes: string
  status: SaleStatus
  paymentStatus: PaymentStatus
  saleTotal: number
  lines: Partial<SaleLine>[]
  linesToAdd: Partial<SaleLine>[]
  linesToUpdate: Partial<SaleLine>[]
  payments: Partial<SalePaymentRecord>[]
}

export interface SaleLine extends BaseModel {
  locationProductId: string
  locationProduct: LocationProduct
  quantity: number
  unitId: string
  unitPrice: number
  lineTotal: number
  conversionFactor?: number
}

export interface SalePaymentRecord extends BaseModel {
  referenceNumber?: string
  saleId?: string
  paymentMethodId: string
  amount: number
  reference: string
  paymentDate: string
  createdOn: string
  voidedReason: string
}
