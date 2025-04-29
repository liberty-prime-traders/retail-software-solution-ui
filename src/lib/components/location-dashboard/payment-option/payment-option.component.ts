import {Component, inject, signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {PaymentOptionService} from '../../../api/payment-option/payment-option.service'
import {AddRowComponent} from '../../reusable/add-row/add-row.component'
import {HasGridComponent} from '../../reusable/has-grid.component'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {NullishToZeroPipe} from '../../../utils/pipes/nullish-to-zero.pipe'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
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
    FormsModule
  ]
})
export class PaymentOptionComponent extends HasGridComponent<PaymentOptionService> {
  private readonly paymentOptionService = inject(PaymentOptionService)
  readonly loading = this.paymentOptionService.selectLoading
  readonly processingIsUnderWay = this.paymentOptionService.processingIsUnderWay
  readonly paymentOptions = this.paymentOptionService.selectAll

  readonly apiService = this.paymentOptionService
  readonly addingIsActive = signal(false)
  readonly rowIsExpanded = signal<boolean>(false)
}
