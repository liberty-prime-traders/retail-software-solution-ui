import {EntityId} from '@ngrx/signals/entities'
import {BaseModel} from '../../util/base-api/base.model'
import {LocationProduct} from '../location-product/location-product.model'
import {PurchaseDeliveryStatus} from './purchase-delivery-status.enum'

export interface PurchaseDelivery extends BaseModel {
  purchaseId: EntityId
  status?: PurchaseDeliveryStatus
  deliveredAt?: string
  notes?: string
  lines: PurchaseDeliveryLine[]
}

export interface PurchaseDeliveryLine {
  id?: EntityId
  referenceNumber?: string
  purchaseLineId: string
  locationProduct?: LocationProduct
  quantityDelivered: number
  unitCost: number
}
