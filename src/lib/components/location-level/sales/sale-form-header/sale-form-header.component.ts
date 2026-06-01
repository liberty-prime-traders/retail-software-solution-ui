import {DatePipe} from '@angular/common'
import {Component, computed, inject} from '@angular/core'
import {Button} from 'primeng/button'
import {Card} from 'primeng/card'
import {Tag} from 'primeng/tag'
import {SaleStatus} from '../../../../api/location-level/sale-summary/sale-status.enum'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../../utils/pipes/prettify-enum.pipe'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
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
    NullSafePipe,
    FormButtonsComponent
  ],
  templateUrl: 'sale-form-header.component.html'
})
export class SaleFormHeaderComponent {
  private readonly context = inject(SaleFormContext)
  private readonly navigator = inject(SaleFormNavigator)

  readonly saleStatus = computed(() => this.saleSession().saleStatus)
  readonly saleSession = this.context.saleSession
  private readonly sessionIsPersisted = computed(() => !!this.saleSession().id)

  readonly saleIsBeyondDraft = computed(() =>
    this.saleStatus() && [SaleStatus.CONFIRMED, SaleStatus.VOIDED].includes(this.saleStatus()!)
  )

  readonly canVoidSale = computed(() =>
    this.sessionIsPersisted() && [SaleStatus.DRAFT, SaleStatus.CONFIRMED].includes(this.saleStatus())
  )

  readonly voidSaleLabel = computed(() =>
    this.saleStatus() === SaleStatus.DRAFT ? 'Discard Draft' : 'Void Sale'
  )

  hideSaleForm() {
    this.navigator.backFromForm()
  }

  voidSale() {
    //this.saleSessionService.voidSale(this.context.saleSession()?.id!, {onSuccess: this.context.loadSession})
  }
}
