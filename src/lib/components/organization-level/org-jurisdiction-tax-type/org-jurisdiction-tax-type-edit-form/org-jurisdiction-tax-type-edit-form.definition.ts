import {disabled, schema, validate} from '@angular/forms/signals'
import {OrgJurisdictionTaxType} from '../../../../api/organization-level/org-jurisdiction-tax-type/org-jurisdiction-tax-type.model'
import {toLocaleDate, toLocaleDateString} from '../../../../utils/dates'

export namespace OrgJurisdictionTaxTypeEditFormDefinition {

  export interface EditFormModel {
    id: string
    startDate: string
    endDate: Date | null
  }

  export const fieldMap = new Map<keyof EditFormModel, string>([
    ['endDate', 'Stop Date']
  ])

  export const defaultFormModel: EditFormModel = {
    id: '',
    startDate: '',
    endDate: null
  }

  export const formSchema = schema<EditFormModel>((path) => {
    disabled(path.startDate)

    validate(path.endDate, ({valueOf}) => {
      const endDate = toLocaleDateString(valueOf(path.endDate))
      const startDate = valueOf(path.startDate)
      if (endDate && startDate && endDate <= startDate) {
        return {kind: 'afterStartDate', message: 'must be after the start date'}
      }
      return null
    })
  })

  export const convertToFormModel = (entity?: OrgJurisdictionTaxType): EditFormModel => ({
    id: entity?.id as string ?? '',
    startDate: entity?.startDate ?? '',
    endDate: entity?.endDate ? toLocaleDate(entity.endDate) : null
  })

  export const convertToBackendModel = (formValue: EditFormModel): Partial<OrgJurisdictionTaxType> => ({
    id: formValue.id,
    endDate: toLocaleDateString(formValue.endDate)
  })
}
