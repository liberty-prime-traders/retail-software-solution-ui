import {CurrencyPipe} from '@angular/common'
import {Component, computed, inject} from '@angular/core'
import {Panel} from 'primeng/panel'
import {TableModule} from 'primeng/table'
import {PaymentSummaryService} from '../../../../api/location-level/payment/payment-summary.service'
import {PrettifyEnumPipe} from '../../../../utils/pipes/prettify-enum.pipe'
import {MoneyComponent} from '../../../reusable/money.component'
import {PaymentsFilterFormDefinition} from './payments-filter/payments-filter-form.definition'
import {buildSummaryGridRows} from './summary-grid-row'

@Component({
  selector: 'rts-payments-summary',
  imports: [
    TableModule,
    Panel,
    CurrencyPipe,
    MoneyComponent,
    PrettifyEnumPipe
  ],
  templateUrl: 'payments-summary.component.html',
  styleUrl: 'payments-summary.component.scss'
})
export class PaymentsSummaryComponent {
  private readonly paymentSummaryService = inject(PaymentSummaryService)

  readonly paymentSummary = this.paymentSummaryService.paymentSummary
  readonly summaries = computed(() => this.paymentSummary()?.summaries ?? [])

  readonly noTypeSelected = computed(() => {
    const summary = this.paymentSummary()
    return !!summary && summary.summaries.length === 0
  })

  readonly emptyStateMessage = 'Tick '
    + PaymentsFilterFormDefinition.ALL_TYPES.map(type => PrettifyEnumPipe.prototype.transform(type)).join(' or ')
    + ' to see totals'

  readonly gridRows = computed(() => {
    const summary = this.paymentSummary()
    return summary ? buildSummaryGridRows(summary) : []
  })
}
