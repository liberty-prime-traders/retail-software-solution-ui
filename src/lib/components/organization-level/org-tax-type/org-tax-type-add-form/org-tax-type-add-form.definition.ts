import {required, schema} from '@angular/forms/signals'
import {OrgTaxType} from '../../../../api/organization-level/org-tax-type/org-tax-type.model'
import {TaxRecoveryType} from '../../../../api/platform-level/tax-type/tax-recovery-type.enum'

export namespace OrgTaxTypeAddFormDefinition {

  export interface AddRowModel {
    jurisdictionTaxTypeId: string
    label: string
    payableAccountCode: string
    recoverableAccountCode: string
    taxRecoveryType: TaxRecoveryType | ''
  }

  export const rowFormSchema = schema<AddRowModel>((path) => {
    required(path.jurisdictionTaxTypeId)
    required(path.payableAccountCode)
    required(path.recoverableAccountCode, {
      when: ({valueOf}) => valueOf(path.taxRecoveryType) === TaxRecoveryType.RECOVERABLE
    })
  })

  export const convertToBackendModel = (row: AddRowModel): Partial<OrgTaxType> => ({
    jurisdictionTaxTypeId: row.jurisdictionTaxTypeId,
    payableAccountCode: row.payableAccountCode,
    recoverableAccountCode: row.recoverableAccountCode || undefined
  })
}
