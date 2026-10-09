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
import {ExpenseVoidedState} from '../../../../api/cross-tier/expense/expense-voided-state.enum'
import {PaymentStatus} from '../../../../api/location-level/purchase/payment-status.enum'
import {EnumToDropdownPipe} from '../../../../utils/pipes/enum-to-dropdown.pipe'
import {FormFieldLayout} from '../../../reusable/form-field/form-field-layout'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {ExpensesFilterState} from './expenses-filter.state'

@Component({
  selector: 'rts-expenses-filter',
  templateUrl: 'expenses-filter.component.html',
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
export class ExpensesFilterComponent {
  readonly state = inject(ExpensesFilterState)

  readonly FormFieldDirection = FormFieldLayout
  readonly PaymentStatus = PaymentStatus
  readonly ExpenseVoidedState = ExpenseVoidedState
}
