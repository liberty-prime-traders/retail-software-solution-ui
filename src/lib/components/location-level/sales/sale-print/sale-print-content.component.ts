import {CurrencyPipe, DatePipe} from '@angular/common'
import {Component, computed, input} from '@angular/core'
import {SaleStatus} from '../../../../api/location-level/sale-summary/sale-status.enum'
import {SaleSession} from '../../../../api/location-level/sale_session/sale-session.model'
import {UnitDescriptionPipe} from '../../../../api/organization-level/unit-conversion/pipes/unit-description.pipe'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../../utils/pipes/prettify-enum.pipe'
import {PrintKeepTogetherDirective, PrintLayout, PrintLayoutKind, printableWidthMm} from '../../../reusable/print'

/** Receipts with less printable width than this (the 58 mm roll) stack amounts under their labels when tight. */
const COMPACT_RECEIPT_MAX_WIDTH_MM = 60

interface SalePrintTotalRow {
  label: string
  amount: number
  emphasis: boolean
}

/**
 * Feature-owned sale document body. It formats values the sale already carries (totals are never recomputed
 * here) and picks one of two structures: a table for sheets, a stacked line list for narrow receipts.
 *
 * It depends on the unit-conversion graph being loaded for unit labels, which the sale screen guarantees
 * because the sale lines render from the same graph.
 */
@Component({
  selector: 'rts-sale-print-content',
  templateUrl: 'sale-print-content.component.html',
  styleUrl: 'sale-print-content.component.scss',
  imports: [
    CurrencyPipe,
    DatePipe,
    NullSafePipe,
    PrettifyEnumPipe,
    UnitDescriptionPipe,
    PrintKeepTogetherDirective
  ]
})
export class SalePrintContentComponent {
  readonly sale = input.required<SaleSession>()
  readonly layout = input.required<PrintLayout>()

  readonly isReceipt = computed(() => this.layout().kind === PrintLayoutKind.RECEIPT)
  readonly isCompactReceipt = computed(() =>
    this.isReceipt() && printableWidthMm(this.layout()) < COMPACT_RECEIPT_MAX_WIDTH_MM
  )
  readonly isDraft = computed(() => this.sale().saleStatus === SaleStatus.DRAFT)
  readonly isVoided = computed(() => this.sale().saleStatus === SaleStatus.VOIDED)

  readonly customerLabel = computed(() =>
    this.sale().walkInCustomer ? 'Walk-in customer' : this.sale().contactLabel
  )

  readonly lines = computed(() =>
    this.sale().saleLines.map(line => ({...line, hasPriceOverride: line.netUnitPrice < line.unitPrice}))
  )

  readonly payments = computed(() => this.sale().salePayments.filter(payment => !payment.voidedReason))

  readonly totalRows = computed<SalePrintTotalRow[]>(() => {
    const totals = this.sale().totals
    const optionalRows: SalePrintTotalRow[] = [
      {label: 'Line discounts', amount: -Math.abs(totals.lineLevelDiscountTotal), emphasis: false},
      {label: 'Order discounts', amount: -Math.abs(totals.orderLevelDiscountTotal), emphasis: false}
    ].filter(row => row.amount)

    return [
      {label: 'Subtotal', amount: totals.displaySubtotal, emphasis: false},
      ...optionalRows,
      {label: 'Total', amount: totals.receivableTotal, emphasis: true},
      {label: 'Paid', amount: totals.paymentTotal, emphasis: false},
      {label: 'Balance due', amount: totals.balance, emphasis: true}
    ]
  })
}
