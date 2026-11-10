import {PurchaseBulkPaymentLine} from '../../../api/location-level/purchase-bulk-payment/purchase-bulk-payment.model'

export interface BulkPaymentRow {
  line: PurchaseBulkPaymentLine
  selected: boolean
  selectable: boolean
  willApply: number
  skipped: boolean
}

const toCents = (amount: number): number => Math.round(amount * 100)

/**
 * A row with nothing payable and nothing applied was skipped by the server.
 * Mirrors the server: the amount fills the selected purchases in grid order, each up to its payable.
 * */
export const buildBulkPaymentRows = (
  lines: PurchaseBulkPaymentLine[],
  selectedPurchaseIds: ReadonlySet<string>,
  amount: number | null
): BulkPaymentRow[] => {
  let remainingCents = toCents(amount ?? 0)
  return lines.map(line => {
    const selected = selectedPurchaseIds.has(line.id)
    const willApplyCents = selected ? Math.min(remainingCents, toCents(line.payable)) : 0
    remainingCents -= willApplyCents
    return {
      line,
      selected,
      selectable: line.payable > 0,
      willApply: willApplyCents / 100,
      skipped: line.payable === 0 && line.appliedAmount === 0
    }
  })
}

export const sumAmounts = (amounts: number[]): number =>
  amounts.reduce((totalCents, amount) => totalCents + toCents(amount), 0) / 100

export const sumPayable = (lines: PurchaseBulkPaymentLine[], selectedPurchaseIds: ReadonlySet<string>): number =>
  lines.filter(line => selectedPurchaseIds.has(line.id))
    .reduce((totalCents, line) => totalCents + toCents(line.payable), 0) / 100
