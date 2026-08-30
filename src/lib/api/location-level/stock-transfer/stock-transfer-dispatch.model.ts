import {StockTransferStatus} from '../../cross-tier/stock-transfer/stock-transfer-status.enum'
import {ReconciledTransferLine} from './reconciled-transfer-line.model'

export interface StockTransferDispatch {
  id: string
  referenceNumber: string
  status: StockTransferStatus
  dispatchedById?: string
  dispatchedAt?: string
  notes?: string
  lines: ReconciledTransferLine[]
}
