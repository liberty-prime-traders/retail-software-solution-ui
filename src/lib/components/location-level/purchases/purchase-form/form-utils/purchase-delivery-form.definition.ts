import {EntityId} from '@ngrx/signals/entities'
import {PurchaseDelivery} from '../../../../../api/location-level/delivery/purchase-delivery.model'
import {PurchaseLineFormDefinition} from './purchase-line-form.definition'

export namespace PurchaseDeliveryFormDefinition {

  export interface DeliveryFormModel {
    deliveredAt: Date | null
    notes: string
    lines: DeliveryLineModel[]
  }

  export interface DeliveryLineModel {
    purchaseLineId: string
    referenceNumber: string
    productGroupName: string
    productName: string
    baseUnit: string
    quantityYetToBeDelivered: number
    quantityDelivered: number
    unitCost: number
  }


  export const createDefault = (purchaseLines: PurchaseLineFormDefinition.PurchaseLineModel[]): DeliveryFormModel => ({
    deliveredAt: null,
    notes: '',
    lines: purchaseLines.filter(line => line.quantityYetToBeDelivered > 0).map(createDeliveryLineFromPurchaseLine)
  })

  const createDeliveryLineFromPurchaseLine = (line: PurchaseLineFormDefinition.PurchaseLineModel): DeliveryLineModel => ({
    purchaseLineId: line.id,
    referenceNumber: line.referenceNumber,
    productGroupName: line.productGroupName,
    productName: line.productName,
    baseUnit: line.baseUnit,
    quantityYetToBeDelivered: line.quantityYetToBeDelivered,
    unitCost: line.unitCost,
    quantityDelivered: 0
  })

  export const toBackendModel =
    (purchaseId: EntityId, formValue: DeliveryFormModel): Partial<PurchaseDelivery> => ({
      purchaseId,
      deliveredAt: formValue.deliveredAt?.toISOString(),
      notes: formValue.notes || undefined,
      lines: formValue.lines
        .filter(line => line.quantityDelivered > 0)
        .map(line => ({
          purchaseLineId: line.purchaseLineId,
          quantityDelivered: line.quantityDelivered,
          unitCost: line.unitCost
        }))
    })
}
