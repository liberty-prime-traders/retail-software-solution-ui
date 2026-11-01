import {ProductSalesSummary} from '../../../../api/location-level/product-sales-report/product-sales-summary.model'

export enum CompareFormat {
  MONEY = 'MONEY',
  PERCENT = 'PERCENT',
  QUANTITY = 'QUANTITY'
}

enum CompareRule {
  NONE = '',
  NET = 'rule-net',
  COGS = 'rule-cogs',
  PROFIT = 'rule-profit'
}

export interface CompareRowDefinition {
  label: string
  field: keyof ProductSalesSummary
  format: CompareFormat
  emphasis: boolean
  indented: boolean
  profit: boolean
  rule: CompareRule
  nullAsZero: boolean
}

const compareRow = (
  label: string,
  field: keyof ProductSalesSummary,
  format: CompareFormat,
  options: Partial<Omit<CompareRowDefinition, 'label' | 'field' | 'format'>> = {}
): CompareRowDefinition => ({
  label, field, format, emphasis: false, indented: false, profit: false, rule: CompareRule.NONE, nullAsZero: false,
  ...options
})

export const COMPARE_ROWS: CompareRowDefinition[] = [
  compareRow('Quantity sold', 'baseQuantity', CompareFormat.QUANTITY),
  compareRow('System selling price', 'avgListPrice', CompareFormat.MONEY, {rule: CompareRule.NET}),
  compareRow('Actual selling price (average)', 'avgSellingPrice', CompareFormat.MONEY),
  compareRow('Gross sales', 'grossSales', CompareFormat.MONEY),
  compareRow('Discounts', 'discountTotal', CompareFormat.MONEY, {indented: true}),
  compareRow('Surcharges', 'surchargeTotal', CompareFormat.MONEY, {indented: true}),
  compareRow('Net sales', 'netSales', CompareFormat.MONEY, {emphasis: true}),
  compareRow('Avg cost / base unit', 'avgCost', CompareFormat.MONEY, {rule: CompareRule.COGS}),
  compareRow('COGS', 'cogs', CompareFormat.MONEY, {emphasis: true}),
  compareRow('Profit / base unit', 'profitPerBaseUnit', CompareFormat.MONEY, {rule: CompareRule.PROFIT}),
  compareRow('Gross profit', 'grossProfit', CompareFormat.MONEY, {emphasis: true, profit: true}),
  compareRow('Margin', 'marginPercent', CompareFormat.PERCENT),
  compareRow(
    'Margin before adjustments', 'marginBeforeAdjustmentsPercent', CompareFormat.PERCENT, {indented: true}
  ),
  compareRow('Adjustment rate', 'adjustmentsPercent', CompareFormat.PERCENT, {indented: true, nullAsZero: true})
]
