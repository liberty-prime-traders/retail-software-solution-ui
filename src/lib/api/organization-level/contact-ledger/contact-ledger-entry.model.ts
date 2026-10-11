import {PaginatedModel} from '../../util/paginated-api/paginated.model'
import {BalanceSignal} from '../chart-of-accounts/balance-signal.enum'
import {ContactLedgerSourceType} from './contact-ledger-source-type.enum'


export interface ContactLedgerEntry extends PaginatedModel {
  createdOn: string
  groupReferenceNumber: string
  sourceType: ContactLedgerSourceType
  sourceReferenceNumber: string
  netBalance: number
  netBalanceSignal: BalanceSignal
  transactionAmount: number
  transactionBalanceSignal: BalanceSignal
}
