import {PaginatedModel} from '../../util/paginated-api/paginated.model'
import {PaymentStatus} from '../purchase/payment-status.enum'
import {SaleStatus} from './sale-status.enum'

export interface SaleSearchResult extends PaginatedModel {
  referenceNumber: string
  contactName: string
  soldBy?: string
  dateSold?: string
  status: SaleStatus
  paymentStatus: PaymentStatus
  arrearsTotal: number
  totalPaid: number
}
