import {BalanceEffect} from '../../organization-level/chart-of-accounts/balance-effect.enum'
import {BaseModel} from '../../util/base-api/base.model'
import {PaymentType} from './payment-type.enum'

export interface PaymentMethodSummary {
  paymentMethodId: string
  paymentMethodName: string
  activeTotal: number
  voidedTotal: number
}

export interface PaymentTypeSummary {
  type: PaymentType
  balanceEffect: BalanceEffect
  activeTotal: number
  voidedTotal: number
  activeCount: number
  voidedCount: number
  methods: PaymentMethodSummary[]
}

export interface PaymentSummary extends BaseModel {
  summaries: PaymentTypeSummary[]
}
