import {CurrencyPipe, DatePipe, NgClass} from '@angular/common'
import {Component, computed, inject} from '@angular/core'
import {ButtonDirective} from 'primeng/button'
import {Divider} from 'primeng/divider'
import {SaleStatus} from '../../../../../api/location-level/sale-summary/sale-status.enum'
import {SaleSessionService} from '../../../../../api/location-level/sale_session/sale-session.service'
import {NullSafePipe} from '../../../../../utils/pipes/null-safe.pipe'
import {FormFieldLayout} from '../../../../reusable/form-field/form-field-layout'
import {FormFieldComponent} from '../../../../reusable/form-field/form-field.component'
import {SaleFormContext} from '../../form-utils/sale-form-context'

@Component({
  selector: 'rts-sale-totals',
  templateUrl: 'sale-totals.component.html',
  imports: [
    Divider,
    ButtonDirective,
    CurrencyPipe,
    NgClass,
    FormFieldComponent,
    NullSafePipe,
    DatePipe

  ]
})
export class SaleTotalsComponent {
  private readonly context = inject(SaleFormContext)
  private readonly saleSessionService = inject(SaleSessionService)

  readonly FormFieldLayout = FormFieldLayout
  readonly saleForm = this.context.saleForm
  readonly saleSession =  this.context.saleSession

  readonly canMakeChangesToTheSale = computed(() => this.saleSession()?.uiOptions.canMakeChangesToTheSale)
  readonly isVoided = computed(() => this.saleSession()?.saleStatus === SaleStatus.VOIDED)

  saveDraft() {
    this.saleSessionService.saveAsDraft({onSuccess: this.context.loadSession})
  }

  completeSale() {
    this.saleSessionService.confirmSession({onSuccess: this.context.loadSession})
  }

}
