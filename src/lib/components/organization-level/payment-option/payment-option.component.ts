import {Component, inject, signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {PaymentOptionService} from '../../../api/organization-level/payment-option/payment-option.service'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {NullishToZeroPipe} from '../../../utils/pipes/nullish-to-zero.pipe'
import {AddRowComponent} from '../../reusable/add-row/add-row.component'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'
import {GridWithAddButtonComponent} from '../../reusable/grid-with-add-button.component'
import {PaymentOptionFormComponent} from './payment-option-form/payment-option-form.component'

@Component({
  selector: 'rts-payment-option',
  templateUrl: 'payment-option.component.html',
  imports: [
    TableModule,
    NullishToZeroPipe,
    NullSafePipe,
    Button,
    PaymentOptionFormComponent,
    AddRowComponent,
    FormsModule,
    GridFilterComponent,
    EmptyRowComponent
  ]
})
export class PaymentOptionComponent extends GridWithAddButtonComponent<PaymentOptionService> {
  private readonly paymentOptionService = inject(PaymentOptionService)
  readonly loading = this.paymentOptionService.selectLoading
  readonly paymentOptions = this.paymentOptionService.selectAll

  readonly apiService = this.paymentOptionService
  readonly addingIsActive = signal(false)
  readonly rowIsExpanded = signal<boolean>(false)
}
