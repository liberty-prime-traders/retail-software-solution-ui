import {Component, computed, effect, inject, input, signal} from '@angular/core'
import {form, FormField} from '@angular/forms/signals'
import {DatePicker} from 'primeng/datepicker'
import {InputText} from 'primeng/inputtext'
import {TaxRateService} from '../../../../api/organization-level/tax-rate/tax-rate.service'
import {TaxRate} from '../../../../api/organization-level/tax-rate/tax-rate.model'
import {minDateFrom} from '../../../../utils/dates'
import {BaseFormComponent} from '../../../reusable/base-form.component'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {TaxRateEditFormDefinition} from './tax-rate-edit-form.definition'

@Component({
  selector: 'rts-tax-rate-edit-form',
  templateUrl: 'tax-rate-edit-form.component.html',
  imports: [
    FormButtonsComponent,
    FormFieldComponent,
    FormField,
    InputText,
    DatePicker,
  ]
})
export class TaxRateEditFormComponent extends BaseFormComponent<TaxRateService> {

  private readonly taxRateService = inject(TaxRateService)
  protected override readonly apiService = this.taxRateService

  readonly taxRate = input<TaxRate | null>(null)

  readonly formValue = signal<TaxRateEditFormDefinition.TaxRateEditFormModel>(
    TaxRateEditFormDefinition.defaultFormModel
  )
  readonly editForm = form(this.formValue, TaxRateEditFormDefinition.formSchema)
  readonly fieldMap = TaxRateEditFormDefinition.fieldMap

  readonly endDateMin = computed(() => minDateFrom(this.taxRate()?.startDate))

  constructor() {
    super()
    effect(() => {
      const rate = this.taxRate()
      if (rate) {
        this.formValue.set(TaxRateEditFormDefinition.convertFromRate(rate))
      }
    })
  }

  resetForm() {
    const rate = this.taxRate()
    if (rate) {
      this.editForm().reset(TaxRateEditFormDefinition.convertFromRate(rate))
    }
  }

  save() {
    const payload = TaxRateEditFormDefinition.convertToBackendModel(this.formValue())
    this.taxRateService.put(payload, {onSuccess: () => this.resetForm()})
  }
}
