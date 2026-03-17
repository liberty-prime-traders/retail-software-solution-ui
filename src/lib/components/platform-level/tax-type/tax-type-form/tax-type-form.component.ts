import {NgClass} from '@angular/common'
import {Component, computed, inject, Input, output, signal} from '@angular/core'
import {FormField, form} from '@angular/forms/signals'
import {InputText} from 'primeng/inputtext'
import {Select} from 'primeng/select'
import {CalculationMethod} from '../../../../api/platform-level/tax-type/calculation-method.enum'
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
    NgClass
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

  resetForm() {
    this.taxTypeForm().reset(TaxTypeFormDefinition.convertToFormModel(this.originalTaxType()))
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
