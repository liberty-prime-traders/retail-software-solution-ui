import {PaginatedModel} from '../../util/paginated-api/paginated.model'
import {SalePaymentStatus} from './sale-payment-status.enum'

export interface SalePaymentSearchResult extends PaginatedModel {
  createdOn: string
  paymentDate?: string
  saleId: string
  saleReferenceNumber: string
  contactId: string
  customerName: string
  paymentMethodId: string
  paymentMethodName: string
  amount: number
  reference?: string
  status: SalePaymentStatus
  voidReason?: string
}
