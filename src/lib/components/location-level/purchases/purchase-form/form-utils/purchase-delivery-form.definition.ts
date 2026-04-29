import {EntityId} from '@ngrx/signals/entities'
import {PurchaseDelivery} from '../../../../../api/location-level/delivery/purchase-delivery.model'
import {ZonedDatesService} from '../../../../../utils/services/zoned-dates.service'
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
    baseUnitId: string
    purchaseLineUnitId: string
    conversionFactor: number | null
    unitId: string
    snapshotUnitId: string
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
    baseUnitId: line.baseUnitId,
    purchaseLineUnitId: line.unitId,
    conversionFactor: line.conversionFactor,
    unitId: line.unitId,
    snapshotUnitId: line.unitId,
    quantityYetToBeDelivered: line.quantityYetToBeDelivered,
    unitCost: line.unitCost,
    quantityDelivered: 0
  })

  export const toBackendModel = (
    purchaseId: EntityId, formValue: DeliveryFormModel, zonedDatesService: ZonedDatesService
  ): Partial<PurchaseDelivery> => ({

      purchaseId,
      deliveredAt: zonedDatesService.toZonedISOString(formValue.deliveredAt),
      notes: formValue.notes || undefined,
      lines: formValue.lines
        .filter(line => line.quantityDelivered > 0)
        .map(line => ({
          purchaseLineId: line.purchaseLineId,
          quantityDelivered: line.quantityDelivered,
          unitCost: line.unitCost,
          unitId: line.unitId
        }))
    })
}
