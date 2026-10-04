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
    taxIsBilledToCustomerSeparately: boolean
    taxIsIncludedInTaxableAmount: boolean
    startDate: Date | null
    endDate: Date | null
    calculationMethod: CalculationMethod | ''
  }

  export const fieldMap = new Map<keyof TaxRateAddFormModel, string>([
    ['orgJurisdictionTaxTypeId', 'Tax Type'],
    ['name', 'Name'],
    ['ratePercentage', 'Rate Percentage'],
    ['rateFlatAmount', 'Flat Rate Amount'],
    ['taxIsBilledToCustomerSeparately', 'Billed to Customer Separately'],
    ['taxIsIncludedInTaxableAmount', 'Included in Taxable Amount'],
    ['startDate', 'Start Date'],
    ['endDate', 'End Date'],
  ])

  export const defaultFormModel: TaxRateAddFormModel = {
    orgJurisdictionTaxTypeId: '',
    name: '',
    ratePercentage: null,
    rateFlatAmount: null,
    taxIsBilledToCustomerSeparately: false,
    taxIsIncludedInTaxableAmount: false,
    startDate: null,
    endDate: null,
    calculationMethod: '',
  }

  export const formSchema = schema<TaxRateAddFormModel>((path) => {
    required(path.orgJurisdictionTaxTypeId)
    required(path.name)
    required(path.startDate)
    required(path.ratePercentage)
    required(path.rateFlatAmount)

    disabled(path.calculationMethod, {when: () => true})

    disabled(
      path.ratePercentage,
      {when: ({valueOf}) => valueOf(path.calculationMethod) !== CalculationMethod.PERCENTAGE}
    )

    disabled(
      path.rateFlatAmount,
      {when: ({valueOf}) => valueOf(path.calculationMethod) !== CalculationMethod.FLAT_PER_UNIT}
    )

    // A tax already included in the taxable amount cannot also be billed separately
    disabled(
      path.taxIsBilledToCustomerSeparately,
      {when: ({valueOf}) => valueOf(path.taxIsIncludedInTaxableAmount)}
    )

    disabled(
      path.taxIsIncludedInTaxableAmount,
      {when: ({valueOf}) => valueOf(path.taxIsBilledToCustomerSeparately)}
    )
  })

  export const convertToBackendModel = (formValue: TaxRateAddFormModel): Partial<TaxRate> => ({
    orgJurisdictionTaxTypeId: formValue.orgJurisdictionTaxTypeId,
    name: formValue.name,
    ratePercentage: formValue.ratePercentage ?? undefined,
    rateFlatAmount: formValue.rateFlatAmount ?? undefined,
    taxIsBilledToCustomerSeparately: formValue.taxIsBilledToCustomerSeparately,
    taxIsIncludedInTaxableAmount: formValue.taxIsIncludedInTaxableAmount,
    startDate: toLocaleDateString(formValue.startDate) || undefined,
    endDate: toLocaleDateString(formValue.endDate) || undefined,
  })
}
