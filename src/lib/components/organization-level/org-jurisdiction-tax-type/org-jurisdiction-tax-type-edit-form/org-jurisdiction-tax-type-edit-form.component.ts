import {Component, inject, Input, signal} from '@angular/core'
import {form, FormField} from '@angular/forms/signals'
import {DatePicker} from 'primeng/datepicker'
import {OrgJurisdictionTaxType} from '../../../../api/organization-level/org-jurisdiction-tax-type/org-jurisdiction-tax-type.model'
import {OrgJurisdictionTaxTypeService} from '../../../../api/organization-level/org-jurisdiction-tax-type/org-jurisdiction-tax-type.service'
import {BaseFormComponent} from '../../../reusable/base-form.component'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {OrgJurisdictionTaxTypeEditFormDefinition} from './org-jurisdiction-tax-type-edit-form.definition'

@Component({
  selector: 'rts-org-jurisdiction-tax-type-edit-form',
  templateUrl: 'org-jurisdiction-tax-type-edit-form.component.html',
  imports: [
    FormButtonsComponent,
    FormFieldComponent,
    DatePicker,
    FormField
  ]
})
export class OrgJurisdictionTaxTypeEditFormComponent extends BaseFormComponent<OrgJurisdictionTaxTypeService> {

  private readonly orgJurisdictionTaxTypeService = inject(OrgJurisdictionTaxTypeService)
  protected override readonly apiService = this.orgJurisdictionTaxTypeService

  @Input()
  set orgJurisdictionTaxType(entity: OrgJurisdictionTaxType | null) {
    if (entity) {
      this.originalTaxType.set(entity)
      this.formValue.set(OrgJurisdictionTaxTypeEditFormDefinition.convertToFormModel(entity))
    }
  }

  readonly formValue = signal<OrgJurisdictionTaxTypeEditFormDefinition.EditFormModel>(
    OrgJurisdictionTaxTypeEditFormDefinition.defaultFormModel
  )

  private readonly originalTaxType = signal<OrgJurisdictionTaxType | null>(null)
  readonly editForm = form(this.formValue, OrgJurisdictionTaxTypeEditFormDefinition.formSchema)
  readonly fieldMap = OrgJurisdictionTaxTypeEditFormDefinition.fieldMap

  resetForm() {
    this.formValue.set(OrgJurisdictionTaxTypeEditFormDefinition.convertToFormModel(this.originalTaxType() ?? undefined))
  }

  save() {
    this.orgJurisdictionTaxTypeService.put(
      OrgJurisdictionTaxTypeEditFormDefinition.convertToBackendModel(this.formValue())
    )
  }
}
