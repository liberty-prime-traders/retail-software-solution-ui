import {CalculationMethod} from '../../platform-level/tax-type/calculation-method.enum'
import {BaseModel} from '../../util/base-api/base.model'
import {PaymentStatus} from '../purchase/payment-status.enum'
import {SaleStatus} from '../sale-summary/sale-status.enum'

export interface SaleSession extends BaseModel {
  createdBy: string
  lastUpdatedAt: string
  lastAccessedBy: string
  lastAccessedAt: string
  contactId: string
  contactLabel: string
  walkInCustomer: boolean | null
  soldBy: string
  dateSold: string
  notes: string
  saleStatus: SaleStatus
  paymentStatus: PaymentStatus
  showActiveUserWarning: boolean
  saleLines: SaleLine[]
  saleAdjustments: SaleAdjustment[]
  salePayments: SalePayment[]
  totals: SaleSessionTotals
  uiOptions: SaleSessionUiOptions
}

export interface SaleSessionUiOptions {
  canMakeChangesToTheSale: boolean
  canAddPaymentsToSale: boolean
}

export interface SessionIdentity {
  id?: string
  transientId?: string
}

export interface SalePayment {
  identity: SessionIdentity
  paymentMethod: string
  amount: number
  reference: string
  paymentDate: string
  voidedReason: string
}

export interface SaleLine {
  identity: SessionIdentity
  locationProductId: string
  productLabel: string
  quantity: number
  unitId: string
  baseUnitId: string
  conversionFactor: number
  unitPrice: number
  lineTotal: number
}

export enum AdjustmentDirection {
  DISCOUNT = 'DISCOUNT',
  SURCHARGE = 'SURCHARGE',
  BOTH = 'BOTH'
}

export interface SaleAdjustment {
  identity: SessionIdentity
  relatedSaleLineIdentity?: SessionIdentity
  adjustmentReasonId: string
  adjustmentReason?: string
  direction: AdjustmentDirection
  calculationMethod: CalculationMethod
  value: number
  calculatedAmount: number
  note?: string
  approvedBy?: string
}

export interface SaleSessionTotals {
  subtotal: number
  lineLevelDiscountTotal: number
  orderLevelDiscountTotal: number
  lineLevelSurchargeTotal: number
  orderLevelSurchargeTotal: number
  paymentTotal: number
  payableTotal: number
  balance: number
}
