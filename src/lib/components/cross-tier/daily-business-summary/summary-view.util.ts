import {BalanceEffect, effectOfSignedAmount} from '../../../api/organization-level/chart-of-accounts/balance-effect.enum'
import {AccountBalanceLine, BalanceSection, BalanceSections} from '../../../api/cross-tier/daily-business-summary/daily-balances.model'
import {DailyPerformanceFigures} from '../../../api/cross-tier/daily-business-summary/daily-performance.model'
import {SystemAccountCode} from '../../../api/cross-tier/daily-business-summary/system-account-code.enum'

export const TODAY_SO_FAR = 'Today, so far'

export interface ProfitAndLossRow {
  label: string
  amount: number
  emphasized: boolean
  topBorder: boolean
}

export interface CollectedRow {
  accountCode: string
  accountName: string
  amount: number
  share: number
}

export enum BalanceRowKind {
  SECTION_HEADER = 'SECTION_HEADER',
  LINE = 'LINE',
  TOTAL = 'TOTAL'
}

export interface BalanceRow {
  kind: BalanceRowKind
  label: string
  caption?: string
  closingBalance?: number
  closingBalanceEffect?: BalanceEffect
  change?: number
  changeEffect?: BalanceEffect
}

export interface NetWorthTile {
  label: string
  caption: string
  amount: number
  change: number
  emphasized: boolean
  changeEffect: BalanceEffect
}

export const hasActivity = (figures: DailyPerformanceFigures): boolean =>
  [
    figures.grossSales, figures.discounts, figures.returnsAndAllowances, figures.costOfGoodsSold, figures.otherIncome,
    figures.expensesTotal, figures.collectedTotal, figures.billedToCustomers
  ].some(amount => amount !== 0)

export const buildProfitAndLossRows = (figures: DailyPerformanceFigures): ProfitAndLossRow[] => {
  const rows: ProfitAndLossRow[] = [
    {label: 'Gross sales', amount: figures.grossSales, emphasized: false, topBorder: false},
    {label: 'Discounts', amount: -figures.discounts, emphasized: false, topBorder: false}
  ]
  if (figures.returnsAndAllowances !== 0) {
    rows.push({label: 'Returns and allowances', amount: -figures.returnsAndAllowances, emphasized: false, topBorder: false})
  }
  rows.push(
    {label: 'Net sales', amount: figures.netSales, emphasized: true, topBorder: false},
    {label: 'Cost of goods sold', amount: -figures.costOfGoodsSold, emphasized: false, topBorder: false},
    {label: 'Gross profit', amount: figures.grossProfit, emphasized: true, topBorder: false}
  )
  if (figures.otherIncome !== 0) {
    rows.push({label: 'Other income', amount: figures.otherIncome, emphasized: false, topBorder: false})
  }
  figures.expenseLines.forEach(line =>
    rows.push({label: line.accountName, amount: -line.amount, emphasized: false, topBorder: false}))
  rows.push({label: 'Net profit', amount: figures.netProfit, emphasized: true, topBorder: true})
  return rows
}

export const buildCollectedRows = (figures: DailyPerformanceFigures): CollectedRow[] =>
  figures.collectedByAccount.map(line => ({
    ...line,
    share: figures.collectedTotal > 0 ? Math.max(0, Math.round(line.amount / figures.collectedTotal * 100)) : 0
  }))

const isDigitalPaymentsLine = (line: AccountBalanceLine): boolean =>
  !!line.accountCode && line.accountCode.startsWith(SystemAccountCode.DIGITAL_PAYMENTS)

const findLine = (section: BalanceSection, accountCode: SystemAccountCode): AccountBalanceLine | undefined =>
  section.lines.find(line => line.accountCode === accountCode)

export const buildNetWorthTiles = (sections: BalanceSections): NetWorthTile[] => {
  const digitalLines = sections.assets.lines.filter(isDigitalPaymentsLine)
  const tileFor = (
    label: string,
    caption: string,
    line?: Pick<AccountBalanceLine, 'closingBalance' | 'change' | 'changeEffect'>
  ): NetWorthTile => ({
    label,
    caption,
    amount: line?.closingBalance ?? 0,
    change: line?.change ?? 0,
    emphasized: false,
    changeEffect: line?.changeEffect ?? BalanceEffect.ZERO
  })
  const digitalPaymentsChange = digitalLines.reduce((total, line) => total + line.change, 0)
  return [
    {
      label: 'Net worth',
      caption: 'What we own minus what we owe',
      amount: sections.netWorth,
      change: sections.netWorthChange,
      emphasized: true,
      changeEffect: sections.netWorthChangeEffect
    },
    tileFor('Cash', '', findLine(sections.assets, SystemAccountCode.CASH)),
    tileFor('Digital payments', 'Digital accounts', {
      closingBalance: digitalLines.reduce((total, line) => total + line.closingBalance, 0),
      change: digitalPaymentsChange,
      changeEffect: effectOfSignedAmount(digitalPaymentsChange)
    }),
    tileFor('Trade receivables', 'Customers owe us', findLine(sections.assets, SystemAccountCode.TRADE_RECEIVABLES)),
    tileFor('Inventory', 'Valued at buying price', findLine(sections.assets, SystemAccountCode.INVENTORY)),
    tileFor('Trade payables', 'We owe', findLine(sections.liabilities, SystemAccountCode.TRADE_PAYABLES))
  ]
}

const ASSET_CAPTIONS: Record<string, string> = {
  [SystemAccountCode.TRADE_RECEIVABLES]: 'Customers owe us',
  [SystemAccountCode.INVENTORY]: 'Valued at buying price'
}

const toBalanceRows = (
  title: string,
  section: BalanceSection,
  captionFor: (line: AccountBalanceLine) => string | undefined
): BalanceRow[] => [
  {kind: BalanceRowKind.SECTION_HEADER, label: title},
  ...section.lines.map(line => ({
    kind: BalanceRowKind.LINE,
    label: line.accountName,
    caption: captionFor(line),
    closingBalance: line.closingBalance,
    closingBalanceEffect: line.closingBalanceEffect,
    change: line.change,
    changeEffect: line.changeEffect
  })),
  {
    kind: BalanceRowKind.TOTAL,
    label: `Total ${title.toLowerCase()}`,
    closingBalance: section.closingTotal,
    change: section.changeTotal,
    changeEffect: section.changeTotalEffect
  }
]

export const buildBalanceRows = (sections: BalanceSections): BalanceRow[] => [
  ...toBalanceRows('Assets', sections.assets, line => line.accountCode ? ASSET_CAPTIONS[line.accountCode] : undefined),
  ...toBalanceRows('Liabilities', sections.liabilities, () => 'We owe')
]
