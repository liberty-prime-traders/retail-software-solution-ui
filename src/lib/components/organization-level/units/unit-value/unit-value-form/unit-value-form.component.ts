import {Component, computed, effect, inject, input, output, signal, untracked} from '@angular/core'
import {FormField, form} from '@angular/forms/signals'
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

  private readonly unitValueService = inject(UnitValueService)
  protected readonly apiService = this.unitValueService

  readonly unitValueCreated = output<UnitValue>()

  readonly unitValueFormModel = signal<UnitValueFormDefinition.UnitValueFormModel>(
    UnitValueFormDefinition.defaultUnitValueFormModel
  )
  readonly unitValueForm = form(
    this.unitValueFormModel,
    UnitValueFormDefinition.unitValueFormSchema
  )
  readonly unitValueFieldMap = UnitValueFormDefinition.fieldMap

  readonly baseUnitFieldRequired = computed(() => {
    const factor = this.unitValueFormModel().conversionFactor
    return factor !== null && factor !== undefined
  })
  readonly conversionFieldRequired = computed(() => {
    const base = this.unitValueFormModel().baseUnit
    return base !== null && base !== undefined && base !== ''
  })

  readonly baseUnitConversionValid = computed(() =>
    UnitValueFormDefinition.isBaseUnitConversionPairValid(this.unitValueFormModel())
  )

  constructor() {
    super()
    effect(() => {
      const current = this.unitValue()
      untracked(() => {
        this.unitValueFormModel.set(
          UnitValueFormDefinition.convertToFormModel(current)
        )
      })
    })
  }

  resetForm() {
    this.unitValueFormModel.set(
      UnitValueFormDefinition.convertToFormModel(this.unitValue())
    )
  }

  upsertUnitValue() {
    const updatedUnitValue: Partial<UnitValue> = {
      ...UnitValueFormDefinition.convertToBackendModel(this.unitValueFormModel()),
      unitGroupId: this.unitGroupId()
    }
    if (!updatedUnitValue.id) {
      this.unitValueService.post(updatedUnitValue, {onSuccess: (saved) => this.unitValueCreated.emit(saved)})
    } else {
      this.unitValueService.put(updatedUnitValue)
    }
  }

  deleteUnitValue() {
    this.unitValueService.delete(this.unitValue()?.id)
  }
}
