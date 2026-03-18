import {required, schema} from '@angular/forms/signals'
import {OrgJurisdictionTaxType} from '../../../../api/organization-level/org-jurisdiction-tax-type/org-jurisdiction-tax-type.model'
import {toLocaleDateString} from '../../../../utils/dates'

export namespace OrgJurisdictionTaxTypeAddFormDefinition {

  export interface AddRowModel {
    jurisdictionTaxTypeId: string
    label: string
    startDate: Date | null
  }

  export const rowFormSchema = schema<AddRowModel>((path) => {
    required(path.jurisdictionTaxTypeId)
    required(path.startDate)
  })

  export const convertToBackendModel = (row: AddRowModel): Partial<OrgJurisdictionTaxType> => ({
    jurisdictionTaxTypeId: row.jurisdictionTaxTypeId,
    startDate: toLocaleDateString(row.startDate)
  })
}
