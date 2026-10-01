import {BaseModel} from '../../util/base-api/base.model'
import {SaleStatus} from './sale-status.enum'

export interface SaleStatusSummary {
  status: SaleStatus
  saleCount: number
  receivableTotal: number
  discountTotal: number
  paidTotal: number
  outstandingTotal: number
  creditTotal: number
}

export interface SaleSearchSummary extends BaseModel {
  statuses: SaleStatusSummary[]
  confirmedReceivableTotal: number
  confirmedDiscountTotal: number
  paidTotal: number
  outstandingTotal: number
  creditTotal: number
  saleCount: number
}
