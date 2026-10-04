import {Component, inject} from '@angular/core'
import {FormField} from '@angular/forms/signals'
import {ButtonDirective} from 'primeng/button'
import {Checkbox} from 'primeng/checkbox'
import {Chip} from 'primeng/chip'
import {Fieldset} from 'primeng/fieldset'
import {InputNumber} from 'primeng/inputnumber'
import {InputText} from 'primeng/inputtext'
import {Select} from 'primeng/select'
import {TaxSourceType} from '../../../../api/location-level/tax-entry/tax-source-type.enum'
import {EnumToDropdownPipe} from '../../../../utils/pipes/enum-to-dropdown.pipe'
import {FormFieldLayout} from '../../../reusable/form-field/form-field-layout'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {TaxesFilterState} from './taxes-filter.state'

@Component({
  selector: 'rts-taxes-filter',
  templateUrl: 'taxes-filter.component.html',
  imports: [
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
export class TaxesFilterComponent {
  readonly state = inject(TaxesFilterState)

  readonly FormFieldDirection = FormFieldLayout
  readonly TaxSourceType = TaxSourceType
}
