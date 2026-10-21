import {BalanceSections} from '../../../api/cross-tier/daily-business-summary/daily-balances.model'
import {DailyPerformanceFigures} from '../../../api/cross-tier/daily-business-summary/daily-performance.model'
import {BalanceEffect} from '../../../api/organization-level/chart-of-accounts/balance-effect.enum'
import {SystemAccountCode} from '../../../api/cross-tier/daily-business-summary/system-account-code.enum'
import {abbreviateAmount} from './abbreviate-amount.util'
import {BalanceRowKind, buildBalanceRows, buildNetWorthTiles, buildProfitAndLossRows, hasActivity} from './summary-view.util'

export const emptyFigures = (): DailyPerformanceFigures => ({
  grossSales: 0, discounts: 0, returnsAndAllowances: 0, netSales: 0, costOfGoodsSold: 0, grossProfit: 0,
  grossMarginPercent: null, otherIncome: 0, expenseLines: [], expensesTotal: 0, netProfit: 0, netMarginPercent: null,
  collectedByAccount: [], collectedTotal: 0, billedToCustomers: 0
})

export const sampleBalances = (): BalanceSections => ({
  assets: {
    lines: [
      {accountCode: SystemAccountCode.CASH, accountName: 'Cash', closingBalance: 1000, closingBalanceEffect: BalanceEffect.ADDS, change: 100, changeEffect: BalanceEffect.ADDS},
      {accountCode: `${SystemAccountCode.DIGITAL_PAYMENTS}.001`, accountName: 'Wallet', closingBalance: 200, closingBalanceEffect: BalanceEffect.ADDS, change: 20, changeEffect: BalanceEffect.ADDS},
      {accountCode: `${SystemAccountCode.DIGITAL_PAYMENTS}.002`, accountName: 'Bank', closingBalance: 300, closingBalanceEffect: BalanceEffect.ADDS, change: -5, changeEffect: BalanceEffect.SUBTRACTS},
      {accountCode: SystemAccountCode.INVENTORY, accountName: 'Inventory', closingBalance: 700, closingBalanceEffect: BalanceEffect.ADDS, change: 0, changeEffect: BalanceEffect.ZERO},
      {accountCode: null, accountName: 'Other assets', closingBalance: 400, closingBalanceEffect: BalanceEffect.ADDS, change: 0, changeEffect: BalanceEffect.ZERO}
    ],
    closingTotal: 2600,
    changeTotal: 115,
    changeTotalEffect: BalanceEffect.ADDS
  },
  liabilities: {
    lines: [
      {accountCode: SystemAccountCode.TRADE_PAYABLES, accountName: 'Trade payables', closingBalance: 600, closingBalanceEffect: BalanceEffect.SUBTRACTS, change: 10, changeEffect: BalanceEffect.SUBTRACTS}
    ],
    closingTotal: 600,
    changeTotal: 10,
    changeTotalEffect: BalanceEffect.SUBTRACTS
  },
  netWorth: 2000,
  netWorthEffect: BalanceEffect.ADDS,
  netWorthChange: 105,
  netWorthChangeEffect: BalanceEffect.ADDS
})

describe('summary view', () => {
  it('hides the returns and other income rows when they are zero and keeps the order', () => {
    const rows = buildProfitAndLossRows({...emptyFigures(), expenseLines: [{accountCode: '005.003', accountName: 'Rent', amount: 50}]})

    expect(rows.map(row => row.label))
      .toEqual(['Gross sales', 'Discounts', 'Net sales', 'Cost of goods sold', 'Gross profit', 'Rent', 'Net profit'])
    expect(rows.find(row => row.label === 'Rent')!.amount).toBe(-50)
  })

  it('shows returns and other income rows when they are not zero', () => {
    const rows = buildProfitAndLossRows({...emptyFigures(), returnsAndAllowances: 5, otherIncome: 7})

    expect(rows.map(row => row.label)).toContain('Returns and allowances')
    expect(rows.map(row => row.label)).toContain('Other income')
  })

  it('treats a view with only zeros as having no activity', () => {
    expect(hasActivity(emptyFigures())).toBeFalse()
    expect(hasActivity({...emptyFigures(), billedToCustomers: 1})).toBeTrue()
  })

  it('builds the six net worth tiles from the balance lines and sums digital payments', () => {
    const tiles = buildNetWorthTiles(sampleBalances())

    expect(tiles.map(tile => tile.label))
      .toEqual(['Net worth', 'Cash', 'Digital payments', 'Trade receivables', 'Inventory', 'Trade payables'])
    expect(tiles[0].amount).toBe(2000)
    expect(tiles[0].changeEffect).toBe(BalanceEffect.ADDS)
    expect(tiles[5].changeEffect).toBe(BalanceEffect.SUBTRACTS)
    expect(tiles[2]).toEqual(jasmine.objectContaining({amount: 500, change: 15, caption: 'Digital accounts'}))
    expect(tiles[3]).toEqual(jasmine.objectContaining({amount: 0, change: 0}))
  })

  it('lists assets and liabilities with their totals and captions', () => {
    const rows = buildBalanceRows(sampleBalances())

    expect(rows.filter(row => row.kind === BalanceRowKind.SECTION_HEADER).map(row => row.label)).toEqual(['Assets', 'Liabilities'])
    expect(rows.find(row => row.label === 'Inventory')!.caption).toBe('Valued at buying price')
    expect(rows.find(row => row.label === 'Trade payables')!.caption).toBe('We owe')
    expect(rows.find(row => row.label === 'Trade payables')!.changeEffect).toBe(BalanceEffect.SUBTRACTS)
    expect(rows.find(row => row.label === 'Cash')!.changeEffect).toBe(BalanceEffect.ADDS)
    expect(rows.find(row => row.label === 'Total assets')!.changeEffect).toBe(BalanceEffect.ADDS)
    expect(rows.filter(row => row.kind === BalanceRowKind.TOTAL).map(row => row.closingBalance)).toEqual([2600, 600])
  })

  it('keeps an irregular closing balance visible on its row instead of colouring it by section', () => {
    const sections = sampleBalances()
    sections.assets.lines[0] = {...sections.assets.lines[0], closingBalance: -50, closingBalanceEffect: BalanceEffect.IRREGULAR}

    expect(buildBalanceRows(sections).find(row => row.label === 'Cash')!.closingBalanceEffect).toBe(BalanceEffect.IRREGULAR)
  })

  it('derives the digital payments tile effect from the summed change', () => {
    const sections = sampleBalances()
    sections.assets.lines[1] = {...sections.assets.lines[1], change: -50, changeEffect: BalanceEffect.SUBTRACTS}

    expect(buildNetWorthTiles(sections)[2].changeEffect).toBe(BalanceEffect.SUBTRACTS)
  })

  it('abbreviates axis ticks', () => {
    expect(abbreviateAmount(4_600_000)).toBe('4.6M')
    expect(abbreviateAmount(120_000)).toBe('120k')
    expect(abbreviateAmount(-1500)).toBe('-1.5k')
    expect(abbreviateAmount(250)).toBe('250')
  })
})
