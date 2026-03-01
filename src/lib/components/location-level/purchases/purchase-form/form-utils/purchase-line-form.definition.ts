import {min, required, schema} from '@angular/forms/signals'
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
    lineTotal: number
  }

  export const purchaseLinesSchema = schema<PurchaseLineModel>((path) => {
    required(path.locationProductId)
    min(
      path.unitCost, 0,
      {message: ({valueOf}) => `Unit cost for ${valueOf(path.productName)} cannot be negative`}
    )
    min(
      path.quantityOrdered, 0,
      {message: ({valueOf}) => `Quantity ordered for ${valueOf(path.productName)} cannot be negative`}
    )
  })

  export const convertLinesToFormModel = (lines: Partial<PurchaseLine>[]): PurchaseLineModel[] =>
    lines.map(line => ({
      id: line.id as string ?? '',
      referenceNumber: line.referenceNumber ?? '',
      locationProductId: line.locationProduct?.id as string ?? '',
      productGroupName: line.locationProduct?.productGroupName ?? '',
      productName: line.locationProduct?.productName ?? '',
      baseUnit: line.locationProduct?.baseUnit ?? '',
      quantityOrdered: line.quantityOrdered ?? 0,
      unitCost: line.unitCost ?? line.lastPurchasePrice ?? 0,
      lineTotal: line.lineTotal ?? 0
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
