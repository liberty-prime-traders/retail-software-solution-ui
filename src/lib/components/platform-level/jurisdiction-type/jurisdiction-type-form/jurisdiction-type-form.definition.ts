import {required, schema} from '@angular/forms/signals'
import {JurisdictionType} from '../../../../api/platform-level/jurisdiction-type/jurisdiction-type.model'

export namespace JurisdictionTypeFormDefinition {
  export interface JurisdictionTypeFormModel {
    id: string
    name: string
    description: string
  }

  export const fieldMap = new Map<keyof JurisdictionTypeFormModel, string>(
    [
      ['name', 'Name'],
      ['description', 'Description']
    ]
  )

  export const defaultJurisdictionTypeFormModel: JurisdictionTypeFormModel = {
    id: '',
    name: '',
    description: ''
  }

  export const jurisdictionTypeFormSchema = schema<JurisdictionTypeFormModel>((path) => {
    required(path.name)
  })

  export const convertToFormModel = (jurisdictionType?: JurisdictionType): JurisdictionTypeFormModel => ({
    id: jurisdictionType?.id as string ?? '',
    name: jurisdictionType?.name ?? '',
    description: jurisdictionType?.description ?? ''
  })

  export const convertToBackendModel = (formValue: JurisdictionTypeFormModel): Partial<JurisdictionType> => ({
    id: formValue.id,
    name: formValue.name,
    description: formValue.description
  })
}
