import {NgClass} from '@angular/common'
import {Component, computed, inject, Input, model, output, signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {form, FormField} from '@angular/forms/signals'
import {Checkbox} from 'primeng/checkbox'
import {InputText} from 'primeng/inputtext'
import {Select} from 'primeng/select'
import {CalculationMethod} from '../../../../api/platform-level/tax-type/calculation-method.enum'
import {TaxApplicationLevelOptions} from '../../../../api/platform-level/tax-type/tax-application-level.enum'
import {TaxRecoveryType} from '../../../../api/platform-level/tax-type/tax-recovery-type.enum'
import {TaxTrigger} from '../../../../api/platform-level/tax-type/tax-trigger.enum'
import {TaxType} from '../../../../api/platform-level/tax-type/tax-type.model'
import {TaxTypeService} from '../../../../api/platform-level/tax-type/tax-type.service'
import {EnumToDropdownPipe} from '../../../../utils/pipes/enum-to-dropdown.pipe'
import {BaseFormComponent} from '../../../reusable/base-form.component'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {TaxTypeFormDefinition} from './tax-type-form.definition'


@Component({
  selector: 'rts-tax-type-form',
  templateUrl: 'tax-type-form.component.html',
  imports: [
    FormButtonsComponent,
    InputText,
    FormFieldComponent,
    FormField,
    Select,
    EnumToDropdownPipe,
    NgClass,
    Checkbox,
    FormsModule
  ]
})
export class TaxTypeFormComponent extends BaseFormComponent<TaxTypeService> {

  private readonly taxTypeService = inject(TaxTypeService)
  protected override apiService: TaxTypeService = this.taxTypeService

  readonly taxTypeCreated = output<void>()

  @Input()
  set taxType(taxType: TaxType | null) {
    if (taxType) {
      this.originalTaxType.set(taxType)
      this.taxTypeFormValue.set(TaxTypeFormDefinition.convertToFormModel(taxType))
      this.selectedTriggers.set(taxType.taxTriggers ?? [])
    }
  }

  readonly originalTaxType = signal<TaxType | undefined>(undefined)

  readonly taxTypeFormValue = signal<TaxTypeFormDefinition.TaxTypeFormModel>(
    TaxTypeFormDefinition.defaultTaxTypeFormModel
  )

  readonly isCreatingNewTaxType = computed(() => !this.taxTypeFormValue()?.id)
  readonly taxTypeForm = form(this.taxTypeFormValue, TaxTypeFormDefinition.taxTypeFormSchema)
  readonly taxTypeFormFields = TaxTypeFormDefinition.fieldMap
  readonly CalculationMethod = CalculationMethod
  readonly TaxRecoveryType = TaxRecoveryType
  readonly TaxTrigger = TaxTrigger
  readonly TaxApplicationLevelOptions = TaxApplicationLevelOptions
  readonly selectedTriggers = model<TaxTrigger[]>([])

  resetForm() {
    this.taxTypeForm().reset(TaxTypeFormDefinition.convertToFormModel(this.originalTaxType()))
    this.selectedTriggers.set(this.originalTaxType()?.taxTriggers ?? [])
  }

  onTriggerChecked() {
    this.taxTypeFormValue.update(formValue => ({
      ...formValue,
      taxTriggers: this.selectedTriggers()
    }))
    this.taxTypeForm().markAsDirty()
  }

  upsertTaxType() {
    const updated: Partial<TaxType> = TaxTypeFormDefinition.convertToBackendModel(this.taxTypeFormValue())
    if (updated.id) {
      this.taxTypeService.put(updated)
    } else {
      this.taxTypeService.post(updated, {onSuccess: () => this.taxTypeCreated.emit()})
    }
  }

  deleteTaxType() {
    if (this.taxTypeFormValue()?.id) {
      this.taxTypeService.delete(this.taxTypeFormValue()?.id)
    }
  }
}
