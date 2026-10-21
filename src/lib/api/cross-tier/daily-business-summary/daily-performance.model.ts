import {BaseModel} from '../../util/base-api/base.model'
import {PeriodStatus} from './period-status.enum'

export interface SummaryAccountAmount {
  accountCode: string
  accountName: string
  amount: number
}

export interface DailyPerformanceFigures {
  grossSales: number
  discounts: number
  returnsAndAllowances: number
  netSales: number
  costOfGoodsSold: number
  grossProfit: number
  grossMarginPercent: number | null
  otherIncome: number
  expenseLines: SummaryAccountAmount[]
  expensesTotal: number
  netProfit: number
  netMarginPercent: number | null
  collectedByAccount: SummaryAccountAmount[]
  collectedTotal: number
  billedToCustomers: number
}

export interface DailyPerformanceDay {
  date: string
  status: PeriodStatus
  figures: DailyPerformanceFigures
}

export interface DailyPerformance extends BaseModel {
  asOf: string
  rangeStatus: PeriodStatus
  days: DailyPerformanceDay[]
  totals: DailyPerformanceFigures
}
