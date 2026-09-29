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
import {PurchaseStatus} from '../../../../api/location-level/purchase/purchase-status.enum'
import {EnumToDropdownPipe} from '../../../../utils/pipes/enum-to-dropdown.pipe'
import {FormFieldLayout} from '../../../reusable/form-field/form-field-layout'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {PurchasesFilterState} from './purchases-filter.state'

@Component({
  selector: 'rts-purchases-filter',
  templateUrl: 'purchases-filter.component.html',
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
export class PurchasesFilterComponent {
  readonly state = inject(PurchasesFilterState)

  readonly FormFieldDirection = FormFieldLayout
  readonly PurchaseStatus = PurchaseStatus
  readonly PaymentStatus = PaymentStatus
}
