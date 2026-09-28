import {CurrencyPipe} from '@angular/common'
import {Component, computed, inject} from '@angular/core'
import {Panel} from 'primeng/panel'
import {Table} from 'primeng/table'
import {SalePaymentSummaryService} from '../../../api/location-level/sale-payment/sale-payment-summary.service'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'

@Component({
  selector: 'rts-sale-payments-summary',
  imports: [
    Table,
    Panel,
    CurrencyPipe,
    EmptyRowComponent
  ],
  templateUrl: 'sale-payments-summary.component.html'
})
export class SalePaymentsSummaryComponent {
  private readonly salePaymentSummaryService = inject(SalePaymentSummaryService)

  readonly salePaymentSummary = this.salePaymentSummaryService.salePaymentSummary
  readonly activePaymentsCount = this.salePaymentSummaryService.activePaymentsCount
  readonly voidedPaymentsCount = this.salePaymentSummaryService.voidedPaymentsCount
  readonly activePaymentsTotal = computed(() => this.salePaymentSummary()?.grandActiveTotal ?? 0)
  readonly voidedPaymentsTotal = computed(() => this.salePaymentSummary()?.grandVoidedTotal ?? 0)

  readonly paymentsPerMethod = computed(() => this.salePaymentSummary()?.methods ?? [])
}
