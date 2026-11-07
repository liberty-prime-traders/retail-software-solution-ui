import {PaymentSummary} from '../../../../api/location-level/payment/payment-summary.model'
import {BalanceEffect} from '../../../../api/organization-level/chart-of-accounts/balance-effect.enum'
import {PrettifyEnumPipe} from '../../../../utils/pipes/prettify-enum.pipe'

export interface SummaryGridRow {
  kind: 'method' | 'total'
  typeCell: { label: string; rowSpan: number } | null
  label: string
  activeTotal: number
  voidedTotal: number
  balanceEffect: BalanceEffect | null
}

export const buildSummaryGridRows = (summary: PaymentSummary): SummaryGridRow[] =>
  summary.summaries.flatMap(section => {
    const methodRows: SummaryGridRow[] = section.methods.map(method => ({
      kind: 'method',
      typeCell: null,
      label: method.paymentMethodName,
      activeTotal: method.activeTotal,
      voidedTotal: method.voidedTotal,
      balanceEffect: null
    }))
    const totalRow: SummaryGridRow = {
      kind: 'total',
      typeCell: null,
      label: 'Total',
      activeTotal: section.activeTotal,
      voidedTotal: section.voidedTotal,
      balanceEffect: section.balanceEffect
    }

    const rows = [...methodRows, totalRow]
    return rows.map((row, index) => ({
      ...row,
      typeCell: index === 0 ? {label: PrettifyEnumPipe.prototype.transform(section.type) + 's', rowSpan: rows.length} : null
    }))
  })
