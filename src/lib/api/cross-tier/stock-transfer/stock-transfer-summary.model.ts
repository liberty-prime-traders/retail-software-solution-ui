import {BaseModel} from '../../util/base-api/base.model'
import {StockTransferStatus} from './stock-transfer-status.enum'

export interface StockTransferSummary extends BaseModel {
  referenceNumber: string,
  sourceLocationName?: string
  destinationLocationName?: string
  status: StockTransferStatus
  lineCount?: number
  totalDispatchedCost?: number
  dispatchedAt?: string
  dispatchedBy?: string
}
