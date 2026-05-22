import {Signal} from '@angular/core'
import {schema, validateTree} from '@angular/forms/signals'
import {SaleLine} from '../../../../api/location-level/sale_session/sale-session.model'

export namespace SaleLineFormDefinition {

  export interface SaleLineFormModel extends SaleLine {
    snapshotUnitId: string
    snapshotQuantity: number
  }

  export const mapSaleLines = (saleLines: SaleLine[]): SaleLineFormModel[] => {
    return saleLines.map(line => ({
      ...line,
      snapshotUnitId: line.unitId,
      snapshotQuantity: line.quantity
    }))
  }

  export const createSaleLineSchema = (productIdsForTouchedLines: Signal<Set<string>>) =>
    schema<SaleLineFormDefinition.SaleLineFormModel>(linePath => {
      validateTree(linePath, ({valueOf}) => {
        if (productIdsForTouchedLines().has(valueOf(linePath.locationProductId))) {
          return {
            kind: 'unconfirmed',
            message: `${valueOf(linePath.productLabel)} has unconfirmed changes.`
          }
        }
        return null
      })
    })
}
