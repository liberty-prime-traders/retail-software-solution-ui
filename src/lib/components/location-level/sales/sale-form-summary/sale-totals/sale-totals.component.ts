import {CurrencyPipe} from '@angular/common'
import {Component, computed, inject} from '@angular/core'
import {Button} from 'primeng/button'
import {Divider} from 'primeng/divider'
import {SaleSessionService} from '../../../../../api/location-level/sale_session/sale-session.service'
import {SaleFormContext} from '../../form-utils/sale-form-context'

@Component({
  selector: 'rts-sale-totals',
  templateUrl: 'sale-totals.component.html',
  imports: [
    Divider,
    Button,
    CurrencyPipe

  ]
})
export class SaleTotalsComponent {
  private readonly context = inject(SaleFormContext)
  private readonly saleSessionService = inject(SaleSessionService)

  readonly saleForm = this.context.saleForm
  readonly saleSession =  this.context.saleSession

  readonly canMakeChangesToTheSale = computed(() => this.saleSession()?.uiOptions.canMakeChangesToTheSale)

  saveDraft() {
    this.saleSessionService.saveAsDraft({onSuccess: this.context.loadSession})
  }

  completeSale() {
    this.saleSessionService.confirmSession({onSuccess: this.context.loadSession})
  }

}
