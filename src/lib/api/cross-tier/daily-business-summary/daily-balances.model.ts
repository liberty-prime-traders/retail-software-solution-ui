import {BaseModel} from '../../util/base-api/base.model'
import {BalanceEffect} from '../../organization-level/chart-of-accounts/balance-effect.enum'
import {PeriodStatus} from './period-status.enum'

export interface AccountBalanceLine {
  accountCode: string | null
  accountName: string
  closingBalance: number
  closingBalanceEffect: BalanceEffect
  change: number
  changeEffect: BalanceEffect
}

export interface BalanceSection {
  lines: AccountBalanceLine[]
  closingTotal: number
  changeTotal: number
  changeTotalEffect: BalanceEffect
}

export interface BalanceSections {
  assets: BalanceSection
  liabilities: BalanceSection
  netWorth: number
  netWorthEffect: BalanceEffect
  netWorthChange: number
  netWorthChangeEffect: BalanceEffect
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
