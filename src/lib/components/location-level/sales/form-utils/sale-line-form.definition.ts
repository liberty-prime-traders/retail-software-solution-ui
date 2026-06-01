import {max, schema, validateTree} from '@angular/forms/signals'
import {SaleLine} from '../../../../api/location-level/sale_session/sale-session.model'

export namespace SaleLineFormDefinition {

  export interface SaleLineFormModel extends SaleLine {
    snapshotUnitId: string
    snapshotQuantity: number
    snapshotUnitPriceOverride: number | null
  }

  export const mapSaleLines = (saleLines: SaleLine[]): SaleLineFormModel[] => {
    return saleLines.map(line => ({
      ...line,
      snapshotUnitId: line.unitId,
      snapshotQuantity: line.quantity,
      snapshotUnitPriceOverride: line.unitPriceOverride
    }))
  }

  export const hasChanged = (saleLine: SaleLineFormDefinition.SaleLineFormModel): boolean => {
    return saleLine.unitId !== saleLine.snapshotUnitId
      || saleLine.quantity !== saleLine.snapshotQuantity
      || saleLine.unitPriceOverride !== saleLine.snapshotUnitPriceOverride
  }

  export const saleLineSchema = schema<SaleLineFormDefinition.SaleLineFormModel>(linePath => {
    validateTree(linePath, ({valueOf}) => {
      if (hasChanged(valueOf(linePath))) {
        return {
          kind: 'unconfirmed',
          message: `${valueOf(linePath.productLabel)} has unconfirmed changes.`
        }
      }
      return null
    })

    max(
      linePath.baseQuantity,
      ({valueOf}) =>  valueOf(linePath.quantityAvailable),
      {message: ({valueOf}) => `${valueOf(linePath.productLabel)} has exceeded the available quantity`}
    )
  })
}
