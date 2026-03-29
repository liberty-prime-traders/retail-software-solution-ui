import {required, schema} from '@angular/forms/signals'
import {OrgTaxType} from '../../../../api/organization-level/org-tax-type/org-tax-type.model'

export namespace OrgTaxTypeAddFormDefinition {

  export interface AddRowModel {
    jurisdictionTaxTypeId: string
    label: string
  }

  export const rowFormSchema = schema<AddRowModel>((path) => {
    required(path.jurisdictionTaxTypeId)
  })

  export const convertToBackendModel = (row: AddRowModel): Partial<OrgTaxType> => ({
    jurisdictionTaxTypeId: row.jurisdictionTaxTypeId
  })
}
