import {Component, effect, inject, input, output, signal} from '@angular/core'
import {form, FormField} from '@angular/forms/signals'
import {EntityId} from '@ngrx/signals/entities'
import {InputNumber} from 'primeng/inputnumber'
import {InputText} from 'primeng/inputtext'
import {Select} from 'primeng/select'
import {UnitValue} from '../../../../../api/organization-level/unit-value/unitvalue.model'
import {UnitValueService} from '../../../../../api/organization-level/unit-value/unitvalue.service'
import {BaseFormComponent} from '../../../../reusable/base-form.component'
import {FormButtonsComponent} from '../../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../../reusable/form-field/form-field.component'
import {UnitValueFormDefinition} from './unit-value-form.definition'

@Component({
  selector: 'rts-unit-value-form',
  templateUrl: 'unit-value-form.component.html',
  imports: [
    InputText,
    FormButtonsComponent,
    FormFieldComponent,
    Select,
    InputNumber,
    FormField
  ]
})
export class UnitValueFormComponent extends BaseFormComponent<UnitValueService> {
  readonly unitValue = input<UnitValue>()
  readonly unitGroupId = input<EntityId>()
  readonly baseUnitOptions = input<Array<UnitValue>>([])
  readonly unitValueCreated = output<UnitValue>()

  private readonly unitValueService = inject(UnitValueService)
  protected readonly apiService = this.unitValueService

  readonly unitValueFormValue = signal<UnitValueFormDefinition.UnitValueFormModel>(
    UnitValueFormDefinition.defaultUnitValueFormModel
  )

  private readonly unitValueFormValueEffect =     effect(() => {
    this.unitValueFormValue.set(UnitValueFormDefinition.convertToFormModel(this.unitValue()))
  })

  readonly unitValueForm = form(this.unitValueFormValue, UnitValueFormDefinition.unitValueFormSchema)
  readonly unitValueFormFields = UnitValueFormDefinition.fieldMap

  resetForm() {
    this.unitValueFormValue.set(UnitValueFormDefinition.convertToFormModel(this.unitValue()))
  }

  upsertUnitValue() {
    const updatedUnitValue: Partial<UnitValue> = {
      ...UnitValueFormDefinition.convertToBackendModel(this.unitValueFormValue()),
      unitGroupId: this.unitGroupId()
    }
    if (updatedUnitValue.id) {
      this.unitValueService.put(updatedUnitValue)
    } else {
      this.unitValueService.post(updatedUnitValue, {onSuccess: (saved) => this.unitValueCreated.emit(saved)})
    }
  }

  deleteUnitValue() {
    this.unitValueService.delete(this.unitValue()?.id)
  }
}
