import {DatePipe} from '@angular/common'
import {Component, computed, inject} from '@angular/core'
import {Button} from 'primeng/button'
import {Card} from 'primeng/card'
import {Tag} from 'primeng/tag'
import {SaleStatus} from '../../../../api/location-level/sale-summary/sale-status.enum'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../../utils/pipes/prettify-enum.pipe'
import {PaymentStatusSeverityPipe} from '../../purchases/payment-status-severity.pipe'
import {SaleFormContext} from '../form-utils/sale-form-context'
import {SaleFormNavigator} from '../form-utils/sale-form-navigator'
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
  private readonly navigator = inject(SaleFormNavigator)

  readonly saleStatus = computed(() => this.saleSession().saleStatus)
  readonly saleSession = this.context.saleSession

  readonly saleIsBeyondDraft = computed(() =>
    this.saleStatus() && [SaleStatus.CONFIRMED, SaleStatus.VOIDED].includes(this.saleStatus()!)
  )

  hideSaleForm() {
    this.navigator.backFromForm()
  }
}
