import {schema} from '@angular/forms/signals'
import {TaxEntrySearchParameters} from '../../../../api/location-level/tax-entry/tax-entry-search-parameters.model'
import {TaxSourceType} from '../../../../api/location-level/tax-entry/tax-source-type.enum'

export namespace TaxesFilterFormDefinition {
  export interface TaxesFilterFormModel {
    fiscalPeriodIds: string[]
    taxTypeIds: string[]
    sourceTypes: TaxSourceType[]
    sourceReferenceNumbers: string[]
    minTaxAmount: number | null
    maxTaxAmount: number | null
  }

  export const MAX_SOURCE_REFERENCE_NUMBERS = 20

  export const createDefaultTaxesFilterFormModel = (): TaxesFilterFormModel => ({
    fiscalPeriodIds: [],
    taxTypeIds: [],
    sourceTypes: [],
    sourceReferenceNumbers: [],
    minTaxAmount: null,
    maxTaxAmount: null
  })

  export const taxesFilterFormSchema = schema<TaxesFilterFormModel>(() => {})

  export const convertToFilterParams = (formValue: TaxesFilterFormModel): TaxEntrySearchParameters => ({
    fiscalPeriodIds: formValue.fiscalPeriodIds.length ? formValue.fiscalPeriodIds : undefined,
    taxTypeIds: formValue.taxTypeIds.length ? formValue.taxTypeIds : undefined,
    sourceTypes: formValue.sourceTypes.length ? formValue.sourceTypes : undefined,
    sourceReferenceNumbers: formValue.sourceReferenceNumbers.length ? formValue.sourceReferenceNumbers : undefined,
    minTaxAmount: formValue.minTaxAmount ?? undefined,
    maxTaxAmount: formValue.maxTaxAmount ?? undefined
  })
}
