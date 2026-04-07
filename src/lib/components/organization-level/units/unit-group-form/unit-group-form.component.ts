import {Component, effect, inject, input, output, signal, untracked} from '@angular/core'
import {FormField, form} from '@angular/forms/signals'
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
    FormButtonsComponent,
    FormFieldComponent,
    FormField
  ]
})
export class UnitGroupFormComponent extends BaseFormComponent<UnitGroupService> {
  readonly unitGroup = input<UnitGroup>()

  private readonly unitGroupService = inject(UnitGroupService)
  protected readonly apiService = this.unitGroupService

  readonly unitGroupCreated = output<UnitGroup>()

  readonly unitGroupFormModel = signal<UnitGroupFormDefinition.UnitGroupFormModel>(
    UnitGroupFormDefinition.defaultUnitGroupFormModel
  )
  readonly unitGroupForm = form(
    this.unitGroupFormModel,
    UnitGroupFormDefinition.unitGroupFormSchema
  )
  readonly unitGroupFieldMap = UnitGroupFormDefinition.fieldMap

  constructor() {
    super()
    effect(() => {
      const current = this.unitGroup()
      untracked(() => {
        this.unitGroupFormModel.set(
          UnitGroupFormDefinition.convertToFormModel(current)
        )
      })
    })
  }

  resetForm() {
    this.unitGroupFormModel.set(
      UnitGroupFormDefinition.convertToFormModel(this.unitGroup())
    )
  }

  upsertUnitGroup() {
    const updatedUnitGroup = UnitGroupFormDefinition.convertToBackendModel(
      this.unitGroupFormModel()
    )
    if (!updatedUnitGroup.id) {
      this.unitGroupService.post(updatedUnitGroup, {onSuccess: (saved) => this.unitGroupCreated.emit(saved)})
    } else {
      this.unitGroupService.put(updatedUnitGroup)
    }
  }

  deleteUnitGroup() {
    this.unitGroupService.delete(this.unitGroup()?.id)
  }
}
