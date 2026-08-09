import {BaseModel} from '../../util/base-api/base.model'
import {StockTransferSummary} from '../../cross-tier/stock-transfer/stock-transfer-summary.model'
import {StockTransferPerspective} from './stock-transfer-perspective.enum'
import {StockTransferDispatch} from './stock-transfer-dispatch.model'
import {StockTransferReceipt} from './stock-transfer-receipt.model'

export interface StockTransferResponse extends BaseModel {
  summary: StockTransferSummary
  dispatch: StockTransferDispatch
  receipt?: StockTransferReceipt
  perspective: StockTransferPerspective
}
