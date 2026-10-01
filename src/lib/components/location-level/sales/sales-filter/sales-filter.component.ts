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
import {PaymentStatus} from '../../../../api/location-level/purchase/payment-status.enum'
import {SaleStatus} from '../../../../api/location-level/sale-summary/sale-status.enum'
import {EnumToDropdownPipe} from '../../../../utils/pipes/enum-to-dropdown.pipe'
import {FormFieldLayout} from '../../../reusable/form-field/form-field-layout'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {SalesFilterState} from './sales-filter.state'

@Component({
  selector: 'rts-sales-filter',
  templateUrl: 'sales-filter.component.html',
  imports: [
    DatePicker,
    FormField,
    FormFieldComponent,
    Select,
    Checkbox,
    InputNumber,
    InputText,
    ButtonDirective,
    Chip,
    Fieldset,
    EnumToDropdownPipe
  ]
})
export class SalesFilterComponent {
  readonly state = inject(SalesFilterState)

  readonly FormFieldDirection = FormFieldLayout
  readonly SaleStatus = SaleStatus
  readonly PaymentStatus = PaymentStatus
}
