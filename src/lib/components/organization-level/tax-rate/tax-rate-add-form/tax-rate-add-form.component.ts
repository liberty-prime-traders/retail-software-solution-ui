import {Component, computed, inject, OnInit, output, signal} from '@angular/core'
import {form, FormField} from '@angular/forms/signals'
import {DatePicker} from 'primeng/datepicker'
import {InputNumber} from 'primeng/inputnumber'
import {InputText} from 'primeng/inputtext'
import {Select} from 'primeng/select'
import {
  OrgTaxTypeService
} from '../../../../api/organization-level/org-tax-type/org-tax-type.service'
import {TaxRateService} from '../../../../api/organization-level/tax-rate/tax-rate.service'
import {CalculationMethod} from '../../../../api/platform-level/tax-type/calculation-method.enum'
import {TaxTypeService} from '../../../../api/platform-level/tax-type/tax-type.service'
import {getToday} from '../../../../utils/dates'
import {BaseFormComponent} from '../../../reusable/base-form.component'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {TaxRateAddFormDefinition} from './tax-rate-add-form.definition'

@Component({
  selector: 'rts-tax-rate-add-form',
  templateUrl: 'tax-rate-add-form.component.html',
  imports: [
    FormButtonsComponent,
    FormFieldComponent,
    FormField,
    InputText,
    InputNumber,
    Select,
    DatePicker
  ]
})
export class TaxRateAddFormComponent extends BaseFormComponent<TaxRateService> implements OnInit {

  private readonly taxRateService = inject(TaxRateService)
  private readonly taxTypeService = inject(TaxTypeService)
  private readonly orgTaxTypeService = inject(OrgTaxTypeService)
  protected override readonly apiService = this.taxRateService

  readonly taxRateCreated = output<void>()

  readonly formValue = signal<TaxRateAddFormDefinition.TaxRateAddFormModel>(TaxRateAddFormDefinition.defaultFormModel)
  readonly taxRateForm = form(this.formValue, TaxRateAddFormDefinition.formSchema)
  readonly fieldMap = TaxRateAddFormDefinition.fieldMap

  readonly orgJurisdictionTaxTypes = this.orgTaxTypeService.activeTaxTypes

  readonly isPercentage = computed(() => this.formValue().calculationMethod === CalculationMethod.PERCENTAGE)
  readonly isFlatPerUnit = computed(() => this.formValue().calculationMethod === CalculationMethod.FLAT_PER_UNIT)

  readonly startDateMin = getToday()
  readonly endDateMin = computed(() => this.formValue().startDate)

  override ngOnInit() {
    super.ngOnInit()
    this.orgTaxTypeService.fetch()
    this.taxTypeService.fetch()
  }

  onOrgTaxTypeChange(selectedId: string) {
    const selected = this.orgTaxTypeService.selectForId(selectedId)
    const calculationMethod = this.taxTypeService.getCalculationMethodForTaxType(selected?.platformTaxId)
    this.formValue.update(v => ({
      ...v,
      calculationMethod,
      ratePercentage: null,
      rateFlatAmount: null,
    }))
  }

  resetForm() {
    this.taxRateForm().reset(TaxRateAddFormDefinition.defaultFormModel)
  }

  save() {
    const payload = TaxRateAddFormDefinition.convertToBackendModel(this.formValue())
    this.taxRateService.post(payload, {onSuccess: () => this.taxRateCreated.emit()})
  }
}
