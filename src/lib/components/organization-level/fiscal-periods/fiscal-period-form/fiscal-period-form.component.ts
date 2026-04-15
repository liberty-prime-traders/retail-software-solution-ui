import {Component, inject, Input, signal} from '@angular/core'
import {form, FormField} from '@angular/forms/signals'
import {InputText} from 'primeng/inputtext'
import {FiscalPeriod} from '../../../../api/organization-level/fiscal-period/fiscal-period.model'
import {FiscalPeriodService} from '../../../../api/organization-level/fiscal-period/fiscal-period.service'
import {BaseFormComponent} from '../../../reusable/base-form.component'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {FiscalPeriodFormDefinition} from './fiscal-period-form.definition'

@Component({
  selector: 'rts-fiscal-period-form',
  templateUrl: 'fiscal-period-form.component.html',
  imports: [
    FormButtonsComponent,
    InputText,
    FormFieldComponent,
    FormField

  ]
})
export class FiscalPeriodFormComponent extends BaseFormComponent<FiscalPeriodService> {
  private readonly fiscalPeriodService = inject(FiscalPeriodService)
  protected override readonly apiService = this.fiscalPeriodService

  readonly originalPeriod = signal<FiscalPeriod|undefined>(undefined)

  readonly formValue = signal<FiscalPeriodFormDefinition.FormModel>(
    FiscalPeriodFormDefinition.defaultFormModel
  )

  readonly periodForm = form(this.formValue, FiscalPeriodFormDefinition.formSchema)
  readonly fieldMap = FiscalPeriodFormDefinition.fieldMap

  @Input()
  set period(period: FiscalPeriod) {
    if (period) {
      this.originalPeriod.set(period)
      this.formValue.set(FiscalPeriodFormDefinition.convertToFormModel(period))
    }
  }

  resetForm() {
    this.formValue.set(FiscalPeriodFormDefinition.convertToFormModel(this.originalPeriod()))
  }

  save() {
    const value = this.formValue()
    this.fiscalPeriodService.rename({id: value.id, name: value.name})
  }
}
