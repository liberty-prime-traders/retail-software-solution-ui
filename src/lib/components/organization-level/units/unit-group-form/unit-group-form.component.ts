import {Component, computed, inject, input} from '@angular/core'
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {isNil} from 'lodash-es'
import {InputText} from 'primeng/inputtext'
import {UnitGroup} from '../../../../api/organization-level/unit-group/unitgroup.model'
import {UnitGroupService} from '../../../../api/organization-level/unit-group/unitgroup.service'
import {BaseFormComponent} from '../../../reusable/base-form.component'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'

@Component({
  selector: 'rts-unit-group-form',
  templateUrl: 'unit-group-form.component.html',
  imports: [
    ReactiveFormsModule,
    InputText,
    FormButtonsComponent,
    FormFieldComponent
  ]
})
export class UnitGroupFormComponent extends BaseFormComponent<UnitGroupService> {
  readonly unitGroup = input<UnitGroup>()

  private readonly unitGroupService = inject(UnitGroupService)
  private readonly formBuilder = inject(FormBuilder)
  protected readonly apiService = this.unitGroupService

  readonly unitGroupForm = computed(() => this.formBuilder.nonNullable.group({
    id: this.unitGroup()?.id,
    name: [this.unitGroup()?.name, Validators.required],
    description: this.unitGroup()?.description
  }))

  resetForm() {
    this.unitGroupForm().reset(this.unitGroup())
  }

  upsertUnitGroup() {
    const updatedUnitGroup: Partial<UnitGroup> = this.unitGroupForm().getRawValue()
    if (isNil(updatedUnitGroup.id)) {
      this.unitGroupService.post(updatedUnitGroup)
    } else {
      this.unitGroupService.put(updatedUnitGroup)
    }
  }

  deleteUnitGroup() {
    this.unitGroupService.delete(this.unitGroup()?.id)
  }
}
