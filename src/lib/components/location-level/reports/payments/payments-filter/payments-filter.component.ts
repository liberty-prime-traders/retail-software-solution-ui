import {Component, inject} from '@angular/core'
import {FormField} from '@angular/forms/signals'
import {ButtonDirective} from 'primeng/button'
import {Checkbox} from 'primeng/checkbox'
import {Chip} from 'primeng/chip'
import {DatePicker} from 'primeng/datepicker'
import {Fieldset} from 'primeng/fieldset'
import {InputNumber} from 'primeng/inputnumber'
import {InputText} from 'primeng/inputtext'
import {Select} from 'primeng/select'
import {PaymentVoidStatus} from '../../../../../api/location-level/payment/payment-void-status.enum'
import {PrettifyEnumPipe} from '../../../../../utils/pipes/prettify-enum.pipe'
import {AutoStretchDirective} from '../../../../reusable/auto-stretch.directive'
import {FormFieldLayout} from '../../../../reusable/form-field/form-field-layout'
import {FormFieldComponent} from '../../../../reusable/form-field/form-field.component'
import {PaymentsFilterState} from './payments-filter.state'

@Component({
  selector: 'rts-payments-filter',
  templateUrl: 'payments-filter.component.html',
  imports: [
    FormFieldComponent,
    DatePicker,
    FormField,
    Select,
    Checkbox,
    InputNumber,
    InputText,
    ButtonDirective,
    Chip,
    PrettifyEnumPipe,
    Fieldset,
    AutoStretchDirective
  ]
})
export class PaymentsFilterComponent {
  readonly state = inject(PaymentsFilterState)

  readonly FormFieldDirection = FormFieldLayout
  readonly PaymentVoidStatus = PaymentVoidStatus
}
