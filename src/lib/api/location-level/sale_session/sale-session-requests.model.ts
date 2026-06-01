import {EntityId} from '@ngrx/signals/entities'
import {CalculationMethod} from '../../platform-level/tax-type/calculation-method.enum'
import {AdjustmentDirection, SessionIdentity} from './sale-session.model'

export interface SaleSessionStartRequest {
  contactId?: string,
  saleId?: EntityId
}

export interface SaleSessionLineRequest {
  additions: SaleSessionLineAddRequest[]
  updates: SaleSessionLineUpdateRequest[]
}

export interface SaleSessionLineAddRequest {
  locationProductId: EntityId,
  quantity: number,
  unitId?: EntityId
}

export interface SaleSessionLineUpdateRequest {
  identity: SessionIdentity,
  quantity: number,
  unitId: string,
  unitPriceOverride: number | null
}

export interface SaleSessionAdjustmentAddRequest {
  relatedSaleLineIdentity?: SessionIdentity,
  adjustmentReasonId: string,
  direction: AdjustmentDirection,
  calculationMethod: CalculationMethod,
  value: number,
  note?: string,
  approvedById?: string
}

export interface SaleSessionPaymentAddRequest {
  paymentMethodId: string,
  amount: number,
  reference?: string,
  paymentDate?: string
}

export interface SaleSessionPaymentRemoveRequest {
  identity: SessionIdentity,
  voidReason?: string
}

export interface SaleSessionHeaderUpdateRequest {
  contactId?: string,
  soldById?: string,
  dateSold?: string,
  notes?: string
}
