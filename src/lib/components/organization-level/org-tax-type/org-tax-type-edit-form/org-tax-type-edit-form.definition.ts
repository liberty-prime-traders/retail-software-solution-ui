import {required, schema} from '@angular/forms/signals'
import {OrgTaxTypeStatus} from '../../../../api/organization-level/org-tax-type/org-tax-type-status.enum'
import {OrgTaxType} from '../../../../api/organization-level/org-tax-type/org-tax-type.model'
import {TaxRecoveryType} from '../../../../api/platform-level/tax-type/tax-recovery-type.enum'

export namespace OrgTaxTypeEditFormDefinition {

  export interface EditFormModel {
    id: string
    status: OrgTaxTypeStatus
    taxRecoveryType: TaxRecoveryType | ''
    payableAccountCode: string
    recoverableAccountCode: string
  }

  export const fieldMap = new Map<keyof EditFormModel, string>([
    ['status', 'Status'],
    ['payableAccountCode', 'Payable Account'],
    ['recoverableAccountCode', 'Recoverable Account']
  ])

  export const defaultFormModel: EditFormModel = {
    id: '',
    status: OrgTaxTypeStatus.ACTIVE,
    taxRecoveryType: '',
    payableAccountCode: '',
    recoverableAccountCode: ''
  }

  export const formSchema = schema<EditFormModel>((path) => {
    required(path.status)
    required(path.payableAccountCode)
  })

  export const convertToFormModel = (entity?: OrgTaxType): EditFormModel => ({
    id: entity?.id as string ?? '',
    status: entity?.status ?? OrgTaxTypeStatus.ACTIVE,
    taxRecoveryType: entity?.taxRecoveryType ?? '',
    payableAccountCode: entity?.payableAccountCode ?? '',
    recoverableAccountCode: entity?.recoverableAccountCode ?? ''
  })

  export const convertToBackendModel = (formValue: EditFormModel): Partial<OrgTaxType> => ({
    id: formValue.id,
    status: formValue.status,
    payableAccountCode: formValue.payableAccountCode,
    recoverableAccountCode: formValue.recoverableAccountCode || undefined
  })
}
