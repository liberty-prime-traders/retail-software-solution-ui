import {Component, inject, Input, output, signal} from '@angular/core'
import {form, FormField} from '@angular/forms/signals'
import {Checkbox} from 'primeng/checkbox'
import {InputText} from 'primeng/inputtext'
import {UnitGroup} from '../../../../api/organization-level/unit-group/unitgroup.model'
import {UnitGroupService} from '../../../../api/organization-level/unit-group/unitgroup.service'
import {BaseFormComponent} from '../../../reusable/base-form.component'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {UnitGroupFormDefinition} from './unit-group-form.definition'

@Component({
  selector: 'rts-unit-group-form',
  templateUrl: 'unit-group-form.component.html',
  imports: [
    InputText,
    Checkbox,
    FormField,
    FormButtonsComponent,
    FormFieldComponent
  ]
})
export class UnitGroupFormComponent extends BaseFormComponent<UnitGroupService> {
  private readonly unitGroupService = inject(UnitGroupService)
  protected readonly apiService = this.unitGroupService

  readonly unitGroupCreated = output<UnitGroup>()

  @Input()
  set unitGroup(unitGroup: UnitGroup | undefined) {
    this.originalUnitGroup.set(unitGroup)
    this.unitGroupFormValue.set(UnitGroupFormDefinition.convertToFormModel(unitGroup))
  }

  readonly originalUnitGroup = signal<UnitGroup | undefined>(undefined)

  readonly unitGroupFormValue = signal<UnitGroupFormDefinition.UnitGroupFormModel>(
    UnitGroupFormDefinition.defaultUnitGroupFormModel
  )

  readonly unitGroupForm = form(this.unitGroupFormValue, UnitGroupFormDefinition.unitGroupFormSchema)
  readonly unitGroupFormFields = UnitGroupFormDefinition.fieldMap

  resetForm() {
    this.unitGroupFormValue.set(UnitGroupFormDefinition.convertToFormModel(this.originalUnitGroup()))
  }

  upsertUnitGroup() {
    const formValue = this.unitGroupFormValue()
    if (formValue.id) {
      this.unitGroupService.put(UnitGroupFormDefinition.convertToUpdateRequest(formValue))
    } else {
      this.unitGroupService.post(UnitGroupFormDefinition.convertToCreateRequest(formValue), {
        onSuccess: (saved) => this.unitGroupCreated.emit(saved)
      })
    }
  }

  deleteUnitGroup() {
    this.unitGroupService.delete(this.originalUnitGroup()?.id)
  }
}
