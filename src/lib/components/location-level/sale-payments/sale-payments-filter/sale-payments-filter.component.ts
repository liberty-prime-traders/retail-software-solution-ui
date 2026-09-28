import {Component, inject} from '@angular/core'
import {FormField} from '@angular/forms/signals'
import {ButtonDirective} from 'primeng/button'
import {Checkbox} from 'primeng/checkbox'
import {Chip} from 'primeng/chip'
import {DatePicker} from 'primeng/datepicker'
import {InputNumber} from 'primeng/inputnumber'
import {InputText} from 'primeng/inputtext'
import {Select} from 'primeng/select'
import {SalePaymentStatus} from '../../../../api/location-level/sale-payment/sale-payment-status.enum'
import {FormFieldLayout} from '../../../reusable/form-field/form-field-layout'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {SalePaymentsFilterState} from './sale-payments-filter.state'

@Component({
  selector: 'rts-sale-payments-filter',
  templateUrl: 'sale-payments-filter.component.html',
  imports: [
    FormFieldComponent,
    DatePicker,
    FormField,
    Select,
    Checkbox,
    InputNumber,
    InputText,
    ButtonDirective,
    Chip
  ]
})
export class SalePaymentsFilterComponent {
  readonly state = inject(SalePaymentsFilterState)

  readonly FormFieldDirection = FormFieldLayout
  readonly SalePaymentStatus = SalePaymentStatus
}
