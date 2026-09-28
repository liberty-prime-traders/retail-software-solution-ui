import {BaseModel} from '../../util/base-api/base.model'

export interface SalePaymentSummary extends BaseModel {
  methods: SalePaymentMethodSummary[]
  grandActiveTotal: number
  grandVoidedTotal: number
  activeCount: number
  voidedCount: number
}

export interface SalePaymentMethodSummary {
  paymentMethodId: string
  paymentMethodName: string
  activeTotal: number
  voidedTotal: number
}
