import {required, schema} from '@angular/forms/signals'
import {OrgTaxTypeStatus} from '../../../../api/organization-level/org-tax-type/org-tax-type-status.enum'
import {OrgTaxType} from '../../../../api/organization-level/org-tax-type/org-tax-type.model'

export namespace OrgTaxTypeEditFormDefinition {

  export interface EditFormModel {
    id: string
    status: OrgTaxTypeStatus
  }

  export const fieldMap = new Map<keyof EditFormModel, string>([
    ['status', 'Status']
  ])

  export const defaultFormModel: EditFormModel = {
    id: '',
    status: OrgTaxTypeStatus.ACTIVE
  }

  export const formSchema = schema<EditFormModel>((path) => {
    required(path.status)
  })

  export const convertToFormModel = (entity?: OrgTaxType): EditFormModel => ({
    id: entity?.id as string ?? '',
    status: entity?.status ?? OrgTaxTypeStatus.ACTIVE
  })

  export const convertToBackendModel = (formValue: EditFormModel): Partial<OrgTaxType> => ({
    id: formValue.id,
    status: formValue.status
  })
}
