import {PurchaseLine} from '../../../../../api/location-level/purchase/purchase.model'

export namespace PurchaseLineFormDefinition {

  export interface PurchaseLineModel {
    id: string
    locationProductId: string
    referenceNumber: string
    productGroupName: string
    productName: string
    baseUnit: string
    quantityOrdered: number
    unitCost: number
    lineTotal: number,
    quantityExpected: number
    quantityDelivered: number
    quantityYetToBeDelivered: number
    quantityCanceled: number
    canceledWithoutSingleDelivery: boolean
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
      quantityCanceled: line.quantityCanceled ?? 0,
      quantityYetToBeDelivered: line.quantityYetToBeDelivered ?? 0,
      canceledWithoutSingleDelivery: (line.quantityYetToBeDelivered ?? 0) + (line.quantityDelivered ?? 0) === 0
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
