import {BaseModel} from '../../util/base-api/base.model'
import {PeriodStatus} from './period-status.enum'

export interface AccountBalanceLine {
  accountCode: string | null
  accountName: string
  closingBalance: number
  change: number
}

export interface BalanceSection {
  lines: AccountBalanceLine[]
  closingTotal: number
  changeTotal: number
}

export interface BalanceSections {
  assets: BalanceSection
  liabilities: BalanceSection
  netWorth: number
  netWorthChange: number
}

export interface DailyBalancesDay {
  date: string
  status: PeriodStatus
  balances: BalanceSections
}

export interface DailyBalances extends BaseModel {
  asOf: string
  rangeStatus: PeriodStatus
  days: DailyBalancesDay[]
  rangeBalances: BalanceSections
}
