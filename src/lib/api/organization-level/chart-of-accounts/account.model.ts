import {BaseModel} from '../../util/base-api/base.model'
import {AccountClassification} from './account-classification.enum'
import {AccountType} from './account-type.enum'

export interface Account extends BaseModel {
  code: string
  name: string
  accountType: AccountType
  classification: AccountClassification
  currencyCode: string
  accountIsPostable: boolean
  accountIsActive: boolean
  accountIsSystemMaintained: boolean
  currentBalance: number
  balanceUpdatedAt?: string
  parentAccountId?: string
  parentAccount?: string
}

