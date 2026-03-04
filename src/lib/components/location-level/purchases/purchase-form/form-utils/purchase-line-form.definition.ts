import {SchemaFn, SchemaPathTree, validate} from '@angular/forms/signals'
import {PurchaseLine} from '../../../../../api/location-level/purchase/purchase.model'

export namespace PurchaseLineFormDefinition {

  export interface PurchaseLineModel {
    id: string
    referenceNumber: string
    locationProductId: string
    productGroupName: string
    productName: string
    baseUnit: string
    quantityOrdered: number
    unitCost: number
    lineTotal: number,
    quantityExpected: number
    quantityDelivered: number
    quantityCanceled: number
  }

  export const purchaseLinesSchema: SchemaFn<PurchaseLineModel> = (path: SchemaPathTree<PurchaseLineModel>) => {
    validate(path.quantityCanceled, ({valueOf}) => {
      const quantityEligibleForCancellation = valueOf(path.quantityOrdered) - valueOf(path.quantityDelivered)
      if (valueOf(path.quantityCanceled) > quantityEligibleForCancellation) {
        return {
          kind: 'exceedsEligibleCancellation',
          message: `${valueOf(path.productName)}: Quantity canceled cannot exceed ${quantityEligibleForCancellation}`
        }
      }
      return null
    })
  }

  export const convertLinesToFormModel = (lines: Partial<PurchaseLine>[]): PurchaseLineModel[] =>
    lines.map(line => ({
      id: line.id as string ?? '',
      referenceNumber: line.locationProduct?.referenceNumber ?? '',
      locationProductId: line.locationProduct?.id as string ?? '',
      productGroupName: line.locationProduct?.productGroupName ?? '',
      productName: line.locationProduct?.productName ?? '',
      baseUnit: line.locationProduct?.baseUnit ?? '',
      quantityOrdered: line.quantityOrdered ?? 0,
      unitCost: line.unitCost ?? line.lastPurchasePrice ?? 0,
      lineTotal: line.lineTotal ?? 0,
      quantityExpected: line.quantityExpected ?? 0,
      quantityDelivered: line.quantityDelivered ?? 0,
      quantityCanceled: line.quantityCanceled ?? 0
    }))

  export const convertLinesToBackendModel = (lines: PurchaseLineModel[]): Partial<PurchaseLine>[] =>
    lines.map(line => {
      const result: Partial<PurchaseLine> = {
        id: line.id,
        locationProductId: line.locationProductId,
        quantityOrdered: line.quantityOrdered,
        unitCost: line.unitCost
      }
      return result
    })
}
