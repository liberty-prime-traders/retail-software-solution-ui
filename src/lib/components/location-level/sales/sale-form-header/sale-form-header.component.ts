import {DatePipe} from '@angular/common'
import {Component, computed, inject, model} from '@angular/core'
import {ButtonDirective} from 'primeng/button'
import {Card} from 'primeng/card'
import {Dialog} from 'primeng/dialog'
import {InputText} from 'primeng/inputtext'
import {Tag} from 'primeng/tag'
import {SaleStatus} from '../../../../api/location-level/sale-summary/sale-status.enum'
import {SaleSessionService} from '../../../../api/location-level/sale_session/sale-session.service'
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
    ButtonDirective,
    Tag,
    PaymentStatusSeverityPipe,
    SaleStatusSeverityPipe,
    PrettifyEnumPipe,
    DatePipe,
    NullSafePipe,
    Dialog,
    InputText
  ],
  templateUrl: 'sale-form-header.component.html'
})
export class SaleFormHeaderComponent {
  private readonly context = inject(SaleFormContext)
  private readonly navigator = inject(SaleFormNavigator)
  readonly showVoidSaleScreen = model(false)
  private readonly saleSessionService = inject(SaleSessionService)

  readonly saleStatus = computed(() => this.saleSession().saleStatus)
  readonly saleSession = this.context.saleSession
  private readonly sessionIsPersisted = computed(() => !!this.saleSession().id)

  readonly saleIsBeyondDraft = computed(() =>
    this.saleStatus() && [SaleStatus.CONFIRMED, SaleStatus.VOIDED].includes(this.saleStatus()!)
  )

  readonly canDiscardSale = computed(() =>
    this.sessionIsPersisted() && [SaleStatus.DRAFT, SaleStatus.CONFIRMED].includes(this.saleStatus())
  )

  readonly discardSaleLabel = computed(() =>
    this.saleStatus() === SaleStatus.DRAFT ? 'Discard Draft' : 'Void Sale'
  )

  hideSaleForm() {
    this.navigator.backFromForm()
  }

  startSaleVoid() {
    this.showVoidSaleScreen.set(true)
  }

  confirmSaleVoid(voidReason: string) {
    this.saleSessionService.discardOrVoidSale(
      voidReason,
      {
        onSuccess: (sale) => {
          this.context.loadSession(sale)
          this.showVoidSaleScreen.set(false)
        }
      }
    )
  }
}
