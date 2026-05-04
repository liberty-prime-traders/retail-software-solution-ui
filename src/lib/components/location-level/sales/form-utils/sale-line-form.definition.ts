import {LocationProduct} from '../../../../api/location-level/location-product/location-product.model'
import {SaleLine} from '../../../../api/location-level/sale/sale.model'

export namespace SaleLineFormDefinition {

  export interface SaleLineModel {
    id: string
    locationProductId: string
    referenceNumber: string
    productName: string
    productGroupName: string
    baseUnitId: string
    unitId: string
    quantity: number
    unitPrice: number
    lineTotal: number
    snapshotUnitId: string
    conversionFactor: number | null
  }

  export const createFromProduct = (product: LocationProduct): SaleLineModel => ({
    id: '',
    locationProductId: product.id as string,
    referenceNumber: product.referenceNumber ?? '',
    productName: product.productName ?? '',
    productGroupName: product.productGroupName ?? '',
    baseUnitId: product.baseUnitId ?? '',
    unitId: product.baseUnitId ?? '',
    quantity: 1,
    unitPrice: product.defaultSalePrice ?? 0,
    lineTotal: product.defaultSalePrice ?? 0,
    conversionFactor: null,
    snapshotUnitId: ''
  })

  export const convertLinesToFormModel = (lines: Partial<SaleLine>[]): SaleLineModel[] => {
    return (lines ?? []).map(line => ({
      id: line.id as string ?? '' ,
      locationProductId: line.locationProduct?.id as string ?? '',
      referenceNumber: line.locationProduct?.referenceNumber ?? '',
      productName: line.locationProduct?.productName ?? '',
      productGroupName: line.locationProduct?.productGroupName ?? '',
      baseUnitId: line.locationProduct?.baseUnitId ?? '',
      unitId: line.unitId ?? '',
      quantity: line.quantity ?? 0,
      unitPrice: line.unitPrice ?? 0,
      lineTotal: line.lineTotal ?? 0,
      snapshotUnitId: line.unitId ?? '',
      conversionFactor: line.conversionFactor ?? null
    }))
  }
}
