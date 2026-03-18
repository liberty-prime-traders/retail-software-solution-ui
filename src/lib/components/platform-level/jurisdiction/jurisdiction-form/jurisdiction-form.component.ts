import {NgClass} from '@angular/common'
import {Component, computed, inject, Input, model, OnInit, output, signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {form, FormField} from '@angular/forms/signals'
import {difference} from 'lodash-es'
import {Checkbox} from 'primeng/checkbox'
import {InputText} from 'primeng/inputtext'
import {Select} from 'primeng/select'
import {JurisdictionTypeService} from '../../../../api/platform-level/jurisdiction-type/jurisdiction-type.service'
import {Jurisdiction} from '../../../../api/platform-level/jurisdiction/jurisdiction.model'
import {JurisdictionService} from '../../../../api/platform-level/jurisdiction/jurisdiction.service'
import {TaxTypeService} from '../../../../api/platform-level/tax-type/tax-type.service'
import {BaseFormComponent} from '../../../reusable/base-form.component'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {LoadingContainerComponent} from '../../../reusable/loading-container/loading-container.component'
import {JurisdictionFormDefinition} from './jurisdiction-form.definition'


@Component({
  selector: 'rts-jurisdiction-form',
  templateUrl: 'jurisdiction-form.component.html',
  imports: [
    FormButtonsComponent,
    InputText,
    FormFieldComponent,
    FormField,
    Select,
    NgClass,
    Checkbox,
    FormsModule,
    LoadingContainerComponent
  ]
})
export class JurisdictionFormComponent extends BaseFormComponent<JurisdictionService> implements OnInit {

  private readonly jurisdictionService = inject(JurisdictionService)
  private readonly jurisdictionTypeService = inject(JurisdictionTypeService)
  private readonly taxTypeService = inject(TaxTypeService)
  protected override apiService: JurisdictionService = this.jurisdictionService

  readonly jurisdictionCreated = output<void>()

  @Input()
  set jurisdiction(jurisdiction: Jurisdiction | null) {
    if (jurisdiction) {
      this.originalJurisdiction.set(jurisdiction)
      this.jurisdictionFormValue.set(JurisdictionFormDefinition.convertToFormModel(jurisdiction))
      this.selectedTaxTypes.set(this.originalTaxTypeIds())
    }
  }

  readonly jurisdictionFormValue = signal<JurisdictionFormDefinition.JurisdictionFormModel>(
    JurisdictionFormDefinition.defaultJurisdictionFormModel
  )

  readonly originalJurisdiction = signal<Jurisdiction | undefined>(undefined)
  readonly isCreatingNewJurisdiction = computed(() => !this.jurisdictionFormValue().id)
  readonly jurisdictionForm = form(this.jurisdictionFormValue, JurisdictionFormDefinition.jurisdictionFormSchema)
  readonly jurisdictionFormFields = JurisdictionFormDefinition.fieldMap
  readonly jurisdictionTypes =this.jurisdictionTypeService.selectAll
  readonly taxTypes = this.taxTypeService.selectAll
  readonly selectedTaxTypes = model<string[]>([])
  private readonly originalTaxTypeIds = computed(() => this.originalJurisdiction()?.taxTypes ?? [])

  readonly parentJurisdictionOptions = computed<Jurisdiction[]>(() =>
    this.jurisdictionService.selectAll().filter(j => j.id !== this.jurisdictionFormValue().id)
  )

  readonly dependenciesLoading = computed(() =>
    this.jurisdictionTypeService.selectLoading() || this.taxTypeService.selectLoading()
  )

  override ngOnInit() {
    super.ngOnInit()
    this.jurisdictionTypeService.fetch()
    this.taxTypeService.fetch()
  }

  resetForm() {
    this.jurisdictionFormValue.set(JurisdictionFormDefinition.convertToFormModel(this.originalJurisdiction()))
    this.selectedTaxTypes.set(this.originalTaxTypeIds())
  }

  onTaxTypeChecked() {
    const taxTypesToAddOrReactivate = difference(this.selectedTaxTypes(), this.originalTaxTypeIds())
    const taxTypesToDiscontinue = difference(this.originalTaxTypeIds(), this.selectedTaxTypes())
    this.jurisdictionFormValue.update(formValue => ({
      ...formValue,
      taxTypesToAddOrReactivate,
      taxTypesToDiscontinue
    }))
    this.jurisdictionForm().markAsDirty()
  }

  upsertJurisdiction() {
    const updated: Partial<Jurisdiction> = JurisdictionFormDefinition.convertToBackendModel(this.jurisdictionFormValue())
    if (updated.id) {
      this.jurisdictionService.put(updated)
    } else {
      this.jurisdictionService.post(updated, {onSuccess: () => this.jurisdictionCreated.emit()})
    }
  }

  deleteJurisdiction() {
    if (this.jurisdictionFormValue()?.id) {
      this.jurisdictionService.delete(this.jurisdictionFormValue()?.id)
    }
  }
}
