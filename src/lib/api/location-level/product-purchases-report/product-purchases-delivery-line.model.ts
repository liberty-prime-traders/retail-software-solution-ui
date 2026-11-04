import {PaginatedModel} from '../../util/paginated-api/paginated.model'
import {PurchaseDeliveryLineStatus} from './purchase-delivery-line-status.enum'

export interface ProductPurchasesDeliveryLine extends PaginatedModel {
  id: string
  purchaseReferenceNumber: string
  deliveryReferenceNumber: string
  deliveredAt: string
  supplierName: string
  quantityDeliveredText: string
  baseQuantity: number
  unitCost: number
  lineTotal: number
  status: PurchaseDeliveryLineStatus
}
