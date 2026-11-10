import {BalanceEffect} from '../../organization-level/chart-of-accounts/balance-effect.enum'
import {PaginatedModel} from '../../util/paginated-api/paginated.model'
import {PaymentType} from './payment-type.enum'

export interface PaymentRow extends PaginatedModel {
  type: PaymentType
  parentReferenceNumber: string
  contactName: string | null
  paymentMethodName: string
  amount: number
  balanceEffect: BalanceEffect
  paymentDate: string
  recordedOn: string
  voided: boolean
  voidedReason: string | null
}
