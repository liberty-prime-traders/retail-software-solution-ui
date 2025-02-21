import {Component, computed, inject, input, OnInit} from '@angular/core'
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {InputText} from 'primeng/inputtext'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {AsyncPipe} from '@angular/common'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {isNil} from 'lodash-es'
import {UnitGroup} from '../../../../api/unit-group/unitgroup.model'
import {UnitGroupService} from '../../../../api/unit-group/unitgroup.service'

@Component({
  standalone: true,
  selector: 'rts-unit-group-form',
  templateUrl: 'unit-group-form.component.html',
  imports: [
    ReactiveFormsModule,
    InputText,
    FormButtonsComponent,
    AsyncPipe,
    FormFieldComponent
  ]
})
export class UnitGroupFormComponent implements OnInit {
  readonly unitGroup = input<UnitGroup>()

  private readonly unitGroupService = inject(UnitGroupService)
  private readonly formBuilder = inject(FormBuilder)

  readonly unitGroupForm = computed(() => this.formBuilder.nonNullable.group({
    id: this.unitGroup()?.id,
    name: [this.unitGroup()?.name, Validators.required],
    description: this.unitGroup()?.description
  }))

  readonly processingStatus$ = this.unitGroupService.processingStatus$()
  readonly failureMessages$ = this.unitGroupService.failureMessages$()

  ngOnInit() {
    this.unitGroupService.resetProcessingStatus()
  }

  resetForm() {
    this.unitGroupForm().reset(this.unitGroup())
  }

  upsertUnitGroup() {
    const updatedUnitGroup: UnitGroup = this.unitGroupForm().getRawValue()
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
