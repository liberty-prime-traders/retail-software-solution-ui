import {EntityId} from '@ngrx/signals/entities'
import {BaseModel} from '../../util/base-api/base.model'
import {LocationProduct} from '../location-product/location-product.model'
import {PurchaseStatus} from './purchase-status.enum'

export interface Purchase extends BaseModel {
  supplierId: string
  supplierName?: string
  status: PurchaseStatus
  notes?: string
  dateOrdered?: string
  orderedBy?: string
  orderedById?: string
  createdBy?: string
  createdOn?: string
  orderTotal?: number
  lines: Partial<PurchaseLine>[]
}

export interface PurchaseLine extends BaseModel {
  locationProduct: LocationProduct
  locationProductId: EntityId
  quantityOrdered: number
  unitCost: number
  lastPurchasePrice: number
  lineTotal: number
  quantityExpected?: number
  quantityDelivered?: number
  quantityCanceled?: number
}

export interface PurchaseLineCancelDto {
  locationProductId: string
  quantityCanceled: number
}
