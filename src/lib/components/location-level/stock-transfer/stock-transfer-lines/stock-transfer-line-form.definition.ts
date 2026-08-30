import {ReconciledTransferLine} from '../../../../api/location-level/stock-transfer/reconciled-transfer-line.model'
import {StockTransferLineUpdateRequest} from '../../../../api/location-level/stock-transfer/stock-transfer-requests.model'

export namespace StockTransferLineFormDefinition {
  export interface StockTransferLineFormModel extends ReconciledTransferLine {
    snapshotQuantity: number
    snapshotUnitId: string
  }

  export const mapLines = (lines: ReconciledTransferLine[]): StockTransferLineFormModel[] =>
    lines.map(line => ({
      ...line,
      snapshotQuantity: line.quantity,
      snapshotUnitId: line.unitId
    }))

  export const hasChanged = (line: StockTransferLineFormModel): boolean =>
    line.quantity !== line.snapshotQuantity || line.unitId !== line.snapshotUnitId

  export const toUpdateRequest = (line: StockTransferLineFormModel): StockTransferLineUpdateRequest => ({
    lineRef: line.dispatchLineRef,
    quantityDispatched: line.quantity,
    unitId: line.unitId
  })
}
