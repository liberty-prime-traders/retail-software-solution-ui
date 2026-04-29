import {EntityId} from '@ngrx/signals/entities'
import {BaseModel} from '../../util/base-api/base.model'
import {LocationProduct} from '../location-product/location-product.model'

export interface PurchaseDelivery extends BaseModel {
  purchaseId: EntityId
  deliveredAt?: string
  notes?: string
  deliveryTotal: number
  lines: PurchaseDeliveryLine[]
}

export interface PurchaseDeliveryLine {
  id?: EntityId
  referenceNumber?: string
  purchaseLineId: string
  unitId: string
  locationProduct?: LocationProduct
  quantityDelivered: number
  unitCost: number
}
