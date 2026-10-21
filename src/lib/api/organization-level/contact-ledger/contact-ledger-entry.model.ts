import {PaginatedModel} from '../../util/paginated-api/paginated.model'
import {BalanceEffect} from '../chart-of-accounts/balance-effect.enum'
import {ContactLedgerSourceType} from './contact-ledger-source-type.enum'


export interface ContactLedgerEntry extends PaginatedModel {
  createdOn: string
  groupReferenceNumber: string
  sourceType: ContactLedgerSourceType
  sourceReferenceNumber: string
  netBalance: number
  netBalanceEffect: BalanceEffect
  transactionAmount: number
  transactionBalanceEffect: BalanceEffect
}
