import {Component, computed, inject, input, OnInit} from '@angular/core'
import {FormBuilder, ReactiveFormsModule, ValidatorFn, Validators} from '@angular/forms'
import {EntityId} from '@ngrx/signals/entities'
import {isNil} from 'lodash-es'
import {InputNumber} from 'primeng/inputnumber'
import {InputText} from 'primeng/inputtext'
import {Select} from 'primeng/select'
import {UnitValue} from '../../../../../api/unit-value/unitvalue.model'
import {UnitValueService} from '../../../../../api/unit-value/unitvalue.service'
import {FormButtonsComponent} from '../../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../../reusable/form-field/form-field.component'

@Component({
  selector: 'rts-unit-value-form',
  templateUrl: 'unit-value-form.component.html',
  imports: [
    ReactiveFormsModule,
    InputText,
    FormButtonsComponent,
    FormFieldComponent,
    Select,
    InputNumber
  ]
})
export class UnitValueFormComponent implements OnInit {
  readonly unitValue = input<UnitValue>()
  readonly unitGroupId = input<EntityId>()
  readonly baseUnitOptions = input<Array<UnitValue>>([])

  private readonly unitValueService = inject(UnitValueService)
  private readonly formBuilder = inject(FormBuilder)

  readonly unitValueForm = computed(() => this.formBuilder.nonNullable.group({
    id: this.unitValue()?.id,
    name: [this.unitValue()?.name, Validators.required],
    code: [this.unitValue()?.code, Validators.required],
    description: this.unitValue()?.description,
    baseUnit: this.unitValue()?.baseUnit,
    conversionFactor: this.unitValue()?.conversionFactor
  }, {validators: this.getDependentFieldsValidator()}))

  readonly processingStatus = this.unitValueService.selectProcessingStatus
  readonly failureMessages = this.unitValueService.selectFailureMessages

  ngOnInit() {
    this.unitValueService.resetProcessingStatus()
  }

  resetForm() {
    this.unitValueForm().reset()
  }

  upsertUnitValue() {
    const updatedUnitValue: Partial<UnitValue> = {
      ...this.unitValueForm().getRawValue(),
      unitGroupId: this.unitGroupId()
    }
    if (isNil(updatedUnitValue.id)) {
      this.unitValueService.post(updatedUnitValue)
    } else {
      this.unitValueService.put(updatedUnitValue)
    }
  }

  deleteUnitValue() {
    this.unitValueService.delete(this.unitValue()?.id)
  }

  private getDependentFieldsValidator(): ValidatorFn {
    return (formGroup) => {
      const baseUnit = formGroup.get('baseUnit')?.value
      const conversionFactor = formGroup.get('conversionFactor')?.value
      const oneOfTheFieldsIsEmpty = isNil(baseUnit) || isNil(conversionFactor)
      const oneOfTheFieldsIsNotEmpty = !isNil(baseUnit) || !isNil(conversionFactor)
      if (oneOfTheFieldsIsEmpty && oneOfTheFieldsIsNotEmpty) {
        return {required: true}
      }
      return null
    }
  }
}
