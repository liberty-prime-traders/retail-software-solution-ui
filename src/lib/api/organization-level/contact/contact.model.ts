import {BaseModel} from '../../util/base-api/base.model'
import {BalanceSignal} from '../chart-of-accounts/balance-signal.enum'
import {ContactStatus} from './contact-status.enum'
import {ContactType} from './contact-type.enum'
import {IdentityType} from './identity-type.enum'

export interface Contact extends BaseModel {
  createdBy: string
  createdOn: number
  contactTypes: ContactType[]
  identityType: IdentityType
  firstName?: string
  lastName?: string
  companyName?: string
  fullName: string
  email?: string
  phone?: string
  address?: string
  creditLimit?: number
  notes?: string
  status: ContactStatus
  systemDefined: boolean
  netBalance: number
  balanceSignal: BalanceSignal
  netOpeningBalance: number
  netOpeningBalanceSignal: BalanceSignal
}
