import {EntityId} from '@ngrx/signals/entities'
import {ProductForPurchase} from '../product-lookup/product-for-purchase.model'
import {BaseModel} from '../../util/base-api/base.model'
import {PurchaseDelivery} from '../delivery/purchase-delivery.model'
import {PaymentStatus} from './payment-status.enum'
import {PurchaseStatus} from './purchase-status.enum'

export interface Purchase extends BaseModel {
  supplierId: string
  supplierName: string
  purchaseStatus: PurchaseStatus
  paymentStatus: PaymentStatus
  notes: string
  dateOrdered: string
  orderedBy: string
  orderedById: string
  createdBy: string
  createdOn: string
  orderedTotal: number,
  deliveredTotal: number,
  paymentCeiling: number,
  lines: Partial<PurchaseLine>[]
  linesToAdd: Partial<PurchaseLine>[]
  linesToUpdate: Partial<PurchaseLine>[]
  deliveries: PurchaseDelivery[]
}

export interface PurchaseLine extends BaseModel {
  locationProduct: ProductForPurchase
  locationProductId: EntityId
  quantityOrdered: number
  unitId: string
  conversionFactor: number
  unitCost: number
  lastPurchasePrice: number
  lineTotal: number
  quantityExpected?: number
  quantityDelivered?: number
  quantityYetToBeDelivered?: number
  quantityCanceled?: number
}

export interface PurchaseLineCancelDto {
  purchaseLineId: string
  quantityCanceled: number
}
