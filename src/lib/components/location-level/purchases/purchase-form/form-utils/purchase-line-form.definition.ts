import {ProductForPurchase} from '../../../../../api/location-level/product-lookup/product-for-purchase.model'
import {PurchaseLine} from '../../../../../api/location-level/purchase/purchase.model'

export namespace PurchaseLineFormDefinition {

  export interface PurchaseLineModel {
    id: string
    locationProductId: string
    referenceNumber: string
    productGroupName: string
    productName: string
    baseUnitId: string
    unitId: string
    snapshotUnitId: string
    conversionFactor: number | null
    quantityOrdered: number
    unitCost: number
    lineTotal: number,
    quantityExpected: number
    quantityDelivered: number
    quantityYetToBeDelivered: number
    quantityCanceled: number
    canceledWithoutSingleDelivery: boolean
  }

  export const createFromProduct = (product: ProductForPurchase): PurchaseLineModel => {
    return  {
      id: '',
      locationProductId: product.id as string,
      referenceNumber: product.referenceNumber ?? '',
      productName: product.productName ?? '',
      productGroupName: product.productGroupName ?? '',
      baseUnitId: product.baseUnitId ?? '',
      unitId: product.baseUnitId ?? '',
      quantityOrdered: 1,
      unitCost: product.lastPurchasePrice ?? 0,
      lineTotal: 0,
      conversionFactor: null,
      snapshotUnitId: '',
      quantityExpected: 1,
      quantityDelivered: 0,
      quantityYetToBeDelivered: 1,
      quantityCanceled: 0,
      canceledWithoutSingleDelivery: false
    }
  }

  export const convertLinesToFormModel = (lines: Partial<PurchaseLine>[]): PurchaseLineModel[] =>
    lines.map(line => ({
      id: line.id as string ?? '',
      referenceNumber: line.locationProduct?.referenceNumber ?? '',
      locationProductId: line.locationProduct?.id as string ?? '',
      productGroupName: line.locationProduct?.productGroupName ?? '',
      productName: line.locationProduct?.productName ?? '',
      baseUnitId: line.locationProduct?.baseUnitId ?? '',
      unitId: line.unitId ?? '',
      snapshotUnitId: line.unitId ?? '',
      conversionFactor: line.conversionFactor ?? null,
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
      return  {
        id: line.id,
        locationProductId: line.locationProductId,
        quantityOrdered: line.quantityOrdered,
        unitCost: line.unitCost,
        unitId: line.unitId
      }
    })
}
