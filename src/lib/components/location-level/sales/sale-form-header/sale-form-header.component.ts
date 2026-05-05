import {DatePipe} from '@angular/common'
import {Component, computed, inject} from '@angular/core'
import {Button} from 'primeng/button'
import {Card} from 'primeng/card'
import {Tag} from 'primeng/tag'
import {SaleStatus} from '../../../../api/location-level/sale/sale-status.enum'
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

  readonly saleStatus = computed(() => this.originalSaleRecord()?.status)
  readonly originalSaleRecord = this.context.originalSale

  readonly saleIsBeyondDraft = computed(() =>
    this.saleStatus() && [SaleStatus.CONFIRMED, SaleStatus.VOIDED].includes(this.saleStatus()!)
  )


  hideSaleForm() {
    this.saleFormVisibilityContext.hideForm()
    this.context.initializeForm(null)
  }
}
