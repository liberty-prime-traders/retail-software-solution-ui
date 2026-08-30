import {StockTransferReceiptStatus} from './stock-transfer-receipt-status.enum'
import {ReconciledTransferLine} from './reconciled-transfer-line.model'

export interface StockTransferReceipt {
  id: string
  referenceNumber: string
  status: StockTransferReceiptStatus
  receivedById: string
  receivedAt: string
  notes?: string
  lines: ReconciledTransferLine[]
}
