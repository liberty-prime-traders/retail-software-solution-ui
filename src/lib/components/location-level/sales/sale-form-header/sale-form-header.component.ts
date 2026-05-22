import {DatePipe} from '@angular/common'
import {Component, computed, inject} from '@angular/core'
import {Button} from 'primeng/button'
import {Card} from 'primeng/card'
import {Tag} from 'primeng/tag'
import {
  SaleSessionSummaryService
} from '../../../../api/location-level/sale-session-summary/sale-session-summary.service'
import {SaleStatus} from '../../../../api/location-level/sale-summary/sale-status.enum'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../../utils/pipes/prettify-enum.pipe'
import {PaymentStatusSeverityPipe} from '../../purchases/payment-status-severity.pipe'
import {SaleFormContext} from '../form-utils/sale-form-context'
import {SaleFormVisibilityContext} from '../sale-form-visibility.context'
import {SaleStatusSeverityPipe} from '../sale-status-severity.pipe'

@Component({
  selector: 'rts-sale-form-header',
  imports: [
    Card,
    Button,
    Tag,
    PaymentStatusSeverityPipe,
    SaleStatusSeverityPipe,
    PrettifyEnumPipe,
    DatePipe,
    NullSafePipe
  ],
  templateUrl: 'sale-form-header.component.html'
})
export class SaleFormHeaderComponent {
  private readonly context = inject(SaleFormContext)
  private readonly saleFormVisibilityContext = inject(SaleFormVisibilityContext)
  private readonly saleSessionSummaryService = inject(SaleSessionSummaryService)

  readonly saleStatus = computed(() => this.saleSession().saleStatus)
  readonly saleSession = this.context.saleSession

  readonly saleIsBeyondDraft = computed(() =>
    this.saleStatus() && [SaleStatus.CONFIRMED, SaleStatus.VOIDED].includes(this.saleStatus()!)
  )

  hideSaleForm() {
    if (this.saleSessionSummaryService.selectCount() > 0) {
      this.context.showOpenSessions()
    } else {
      this.saleFormVisibilityContext.hideForm()
    }
  }
}
