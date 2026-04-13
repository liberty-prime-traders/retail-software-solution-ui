import {NgClass} from '@angular/common'
import {Component, inject} from '@angular/core'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {PaymentOptionService} from '../../../api/organization-level/payment-option/payment-option.service'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {AutoStretchDirective} from '../../reusable/auto-stretch.directive'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'
import {GridWithAddButtonComponent} from '../../reusable/grid-with-add-button.component'
import {NewFormCancelButtonComponent} from '../../reusable/new-form-cancel-button.component'
import {PaymentOptionFormComponent} from './payment-option-form/payment-option-form.component'

@Component({
  selector: 'rts-payment-option',
  templateUrl: 'payment-option.component.html',
  imports: [
    TableModule,
    NullSafePipe,
    Button,
    PaymentOptionFormComponent,
    GridFilterComponent,
    EmptyRowComponent,
    NgClass,
    NewFormCancelButtonComponent,
    AutoStretchDirective
  ]
})
export class PaymentOptionComponent extends GridWithAddButtonComponent<PaymentOptionService> {
  private readonly paymentOptionService = inject(PaymentOptionService)
  readonly paymentOptions = this.paymentOptionService.selectAll
  readonly apiService = this.paymentOptionService
}
