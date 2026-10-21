import {BalanceEffect} from '../chart-of-accounts/balance-effect.enum'
import {BaseModel} from '../../util/base-api/base.model'
import {ContactSubledgerDirection} from './contact-subledger-direction.enum'

export interface ContactOpeningBalanceRevision extends BaseModel {
  contactReferenceNumber: string
  changedAt: string
  changedBy: string
  subledgerDirection: ContactSubledgerDirection
  amount: number
  balanceEffect: BalanceEffect
}
