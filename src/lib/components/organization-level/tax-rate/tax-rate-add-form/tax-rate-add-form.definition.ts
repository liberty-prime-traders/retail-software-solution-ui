import {disabled, required, schema} from '@angular/forms/signals'
import {CalculationMethod} from '../../../../api/platform-level/tax-type/calculation-method.enum'
import {TaxRate} from '../../../../api/organization-level/tax-rate/tax-rate.model'
import {toLocaleDateString} from '../../../../utils/dates'

export namespace TaxRateAddFormDefinition {

  export interface TaxRateAddFormModel {
    orgJurisdictionTaxTypeId: string
    name: string
    ratePercentage: number | null
    rateFlatAmount: number | null
    startDate: Date | null
    endDate: Date | null
    calculationMethod: CalculationMethod | ''
  }

  export const fieldMap = new Map<keyof TaxRateAddFormModel, string>([
    ['orgJurisdictionTaxTypeId', 'Tax Type'],
    ['name', 'Name'],
    ['ratePercentage', 'Rate Percentage'],
    ['rateFlatAmount', 'Flat Rate Amount'],
    ['startDate', 'Start Date'],
    ['endDate', 'End Date'],
  ])

  export const defaultFormModel: TaxRateAddFormModel = {
    orgJurisdictionTaxTypeId: '',
    name: '',
    ratePercentage: null,
    rateFlatAmount: null,
    startDate: null,
    endDate: null,
    calculationMethod: '',
  }

  export const formSchema = schema<TaxRateAddFormModel>((path) => {
    required(path.orgJurisdictionTaxTypeId)
    required(path.name)
    required(path.startDate)
    disabled(path.calculationMethod, () => true)
    required(path.ratePercentage)
    disabled(path.ratePercentage, ({valueOf}) => valueOf(path.calculationMethod) !== CalculationMethod.PERCENTAGE)
    required(path.rateFlatAmount)
    disabled(path.rateFlatAmount, ({valueOf}) => valueOf(path.calculationMethod) !== CalculationMethod.FLAT_PER_UNIT)
  })

  export const convertToBackendModel = (formValue: TaxRateAddFormModel): Partial<TaxRate> => ({
    orgJurisdictionTaxTypeId: formValue.orgJurisdictionTaxTypeId,
    name: formValue.name,
    ratePercentage: formValue.ratePercentage ?? undefined,
    rateFlatAmount: formValue.rateFlatAmount ?? undefined,
    startDate: toLocaleDateString(formValue.startDate) || undefined,
    endDate: toLocaleDateString(formValue.endDate) || undefined,
  })
}
