import {NgClass} from '@angular/common'
import {Component, computed, inject, Input, output, signal} from '@angular/core'
import {FormField, form} from '@angular/forms/signals'
import {InputText} from 'primeng/inputtext'
import {JurisdictionType} from '../../../../api/platform-level/jurisdiction-type/jurisdiction-type.model'
import {JurisdictionTypeService} from '../../../../api/platform-level/jurisdiction-type/jurisdiction-type.service'
import {BaseFormComponent} from '../../../reusable/base-form.component'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {JurisdictionTypeFormDefinition} from './jurisdiction-type-form.definition'


@Component({
  selector: 'rts-jurisdiction-type-form',
  templateUrl: 'jurisdiction-type-form.component.html',
  imports: [
    FormButtonsComponent,
    InputText,
    FormFieldComponent,
    FormField,
    NgClass
  ]
})
export class JurisdictionTypeFormComponent extends BaseFormComponent<JurisdictionTypeService> {

  private readonly jurisdictionTypeService = inject(JurisdictionTypeService)
  protected override apiService: JurisdictionTypeService = this.jurisdictionTypeService

  readonly jurisdictionTypeCreated = output<void>()

  @Input()
  set jurisdictionType(jurisdictionType: JurisdictionType | null) {
    if (jurisdictionType) {
      this.originalJurisdictionType.set(jurisdictionType)
      this.jurisdictionTypeFormValue.set(JurisdictionTypeFormDefinition.convertToFormModel(jurisdictionType))
    }
  }

  readonly originalJurisdictionType = signal<JurisdictionType | undefined>(undefined)

  readonly jurisdictionTypeFormValue = signal<JurisdictionTypeFormDefinition.JurisdictionTypeFormModel>(
    JurisdictionTypeFormDefinition.defaultJurisdictionTypeFormModel
  )

  readonly isCreatingNewJurisdictionType = computed(() => !this.jurisdictionTypeFormValue().id)
  readonly jurisdictionTypeForm = form(this.jurisdictionTypeFormValue, JurisdictionTypeFormDefinition.jurisdictionTypeFormSchema)
  readonly jurisdictionTypeFormFields = JurisdictionTypeFormDefinition.fieldMap

  resetForm() {
    this.jurisdictionTypeFormValue.set(JurisdictionTypeFormDefinition.convertToFormModel(this.originalJurisdictionType()))
  }

  upsertJurisdictionType() {
    const updated: Partial<JurisdictionType> = JurisdictionTypeFormDefinition.convertToBackendModel(this.jurisdictionTypeFormValue())
    if (updated.id) {
      this.jurisdictionTypeService.put(updated)
    } else {
      this.jurisdictionTypeService.post(updated, {onSuccess: () => this.jurisdictionTypeCreated.emit()})
    }
  }

  deleteJurisdictionType() {
    if (this.jurisdictionTypeFormValue()?.id) {
      this.jurisdictionTypeService.delete(this.jurisdictionTypeFormValue()?.id)
    }
  }
}
