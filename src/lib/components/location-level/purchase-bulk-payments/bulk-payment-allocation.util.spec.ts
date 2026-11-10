import {PaymentStatus} from '../../../api/location-level/purchase/payment-status.enum'
import {PurchaseStatus} from '../../../api/location-level/purchase/purchase-status.enum'
import {PurchaseBulkPaymentLine} from '../../../api/location-level/purchase-bulk-payment/purchase-bulk-payment.model'
import {buildBulkPaymentRows, sumPayable} from './bulk-payment-allocation.util'

describe('bulk payment allocation', () => {
  const line = (purchaseId: string, payable: number): PurchaseBulkPaymentLine => ({
    id: purchaseId,
    referenceNumber: purchaseId,
    purchaseStatus: PurchaseStatus.ORDERED,
    orderedTotal: payable,
    paymentCeiling: payable,
    paidTotal: 0,
    payable,
    paymentStatus: PaymentStatus.UNPAID,
    appliedAmount: 0
  }) as PurchaseBulkPaymentLine

  it('fills the selected rows in order, each up to its payable', () => {
    const rows = buildBulkPaymentRows(
      [line('a', 100), line('b', 50), line('c', 80)], new Set(['a', 'b', 'c']), 120
    )

    expect(rows.map(row => row.willApply)).toEqual([100, 20, 0])
  })

  it('applies nothing to unselected rows', () => {
    const rows = buildBulkPaymentRows([line('a', 100), line('b', 50)], new Set(['b']), 70)

    expect(rows.map(row => row.willApply)).toEqual([0, 50])
  })

  it('does not drift on fractional amounts', () => {
    const rows = buildBulkPaymentRows([line('a', 0.1), line('b', 0.2)], new Set(['a', 'b']), 0.3)

    expect(rows.map(row => row.willApply)).toEqual([0.1, 0.2])
  })

  it('treats a missing amount as nothing to apply and flags rows with no payable as not selectable', () => {
    const rows = buildBulkPaymentRows([line('a', 100), line('b', 0)], new Set(['a']), null)

    expect(rows.map(row => row.willApply)).toEqual([0, 0])
    expect(rows.map(row => row.selectable)).toEqual([true, false])
  })

  it('marks a row with nothing payable and nothing applied as skipped', () => {
    const rows = buildBulkPaymentRows([line('a', 0), line('b', 10)], new Set(), null)

    expect(rows.map(row => row.skipped)).toEqual([true, false])
  })

  it('sums the payable of the selected rows only', () => {
    expect(sumPayable([line('a', 0.1), line('b', 0.2), line('c', 5)], new Set(['a', 'b']))).toBe(0.3)
  })
})
