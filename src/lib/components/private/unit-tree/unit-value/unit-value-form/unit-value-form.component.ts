import {Component, computed, inject, input, OnInit} from '@angular/core'
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {InputText} from 'primeng/inputtext'
import {FormButtonsComponent} from '../../../../reusable/form-buttons/form-buttons.component'
import {AsyncPipe} from '@angular/common'
import {FormFieldComponent} from '../../../../reusable/form-field/form-field.component'
import {isNil} from 'lodash-es'
import {UnitValue} from '../../../../../api/unit-value/unitvalue.model'
import {UnitValueService} from '../../../../../api/unit-value/unitvalue.service'

@Component({
  standalone: true,
  selector: 'rts-unit-value-form',
  templateUrl: 'unit-value-form.component.html',
  imports: [
    ReactiveFormsModule,
    InputText,
    FormButtonsComponent,
    AsyncPipe,
    FormFieldComponent
  ]
})
export class UnitValueFormComponent implements OnInit {
  readonly unitValue = input<UnitValue>()
  readonly unitGroupId = input<string>()

  private readonly unitValueService = inject(UnitValueService)
  private readonly formBuilder = inject(FormBuilder)

  readonly unitValueForm = computed(() => this.formBuilder.nonNullable.group({
    id: this.unitValue()?.id,
    name: [this.unitValue()?.name, Validators.required],
    code: this.unitValue()?.code,
    description: this.unitValue()?.description,
    baseUnit: this.unitValue()?.baseUnit,
    conversionFactor: this.unitValue()?.conversionFactor
  }))

  readonly processingStatus$ = this.unitValueService.processingStatus$()
  readonly failureMessages$ = this.unitValueService.failureMessages$()

  ngOnInit() {
    this.unitValueService.resetProcessingStatus()
  }

  resetForm() {
    this.unitValueForm().reset(this.unitValue())
  }

  upsertUnitValue() {
    const updatedUnitValue: UnitValue = {...this.unitValueForm().getRawValue(), unitGroupId: this.unitGroupId()}
    if (isNil(updatedUnitValue.id)) {
      this.unitValueService.post(updatedUnitValue)
    } else {
      this.unitValueService.put(updatedUnitValue)
    }
  }

  deleteUnitValue() {
    this.unitValueService.delete(this.unitValue()?.id)
  }
}
