import {Component, inject, Input, signal} from '@angular/core'
import {form, FormField} from '@angular/forms/signals'
import {Select} from 'primeng/select'
import {OrgTaxTypeStatus} from '../../../../api/organization-level/org-tax-type/org-tax-type-status.enum'
import {OrgTaxType} from '../../../../api/organization-level/org-tax-type/org-tax-type.model'
import {OrgTaxTypeService} from '../../../../api/organization-level/org-tax-type/org-tax-type.service'
import {EnumToDropdownPipe} from '../../../../utils/pipes/enum-to-dropdown.pipe'
import {BaseFormComponent} from '../../../reusable/base-form.component'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {OrgTaxTypeEditFormDefinition} from './org-tax-type-edit-form.definition'

@Component({
  selector: 'rts-org-tax-type-edit-form',
  templateUrl: 'org-tax-type-edit-form.component.html',
  imports: [
    FormButtonsComponent,
    FormFieldComponent,
    Select,
    FormField,
    EnumToDropdownPipe
  ]
})
export class OrgTaxTypeEditFormComponent extends BaseFormComponent<OrgTaxTypeService> {

  private readonly orgJurisdictionTaxTypeService = inject(OrgTaxTypeService)
  protected override readonly apiService = this.orgJurisdictionTaxTypeService

  @Input()
  set orgJurisdictionTaxType(entity: OrgTaxType | null) {
    if (entity) {
      this.originalTaxType.set(entity)
      this.formValue.set(OrgTaxTypeEditFormDefinition.convertToFormModel(entity))
    }
  }

  readonly formValue = signal<OrgTaxTypeEditFormDefinition.EditFormModel>(
    OrgTaxTypeEditFormDefinition.defaultFormModel
  )

  private readonly originalTaxType = signal<OrgTaxType | null>(null)
  readonly editForm = form(this.formValue, OrgTaxTypeEditFormDefinition.formSchema)
  readonly fieldMap = OrgTaxTypeEditFormDefinition.fieldMap
  readonly statusOptions = OrgTaxTypeStatus

  resetForm() {
    this.formValue.set(OrgTaxTypeEditFormDefinition.convertToFormModel(this.originalTaxType() ?? undefined))
  }

  save() {
    this.orgJurisdictionTaxTypeService.put(
      OrgTaxTypeEditFormDefinition.convertToBackendModel(this.formValue())
    )
  }
}
