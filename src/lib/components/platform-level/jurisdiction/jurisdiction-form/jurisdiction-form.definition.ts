import {required, schema} from '@angular/forms/signals'
import {Jurisdiction} from '../../../../api/platform-level/jurisdiction/jurisdiction.model'

export namespace JurisdictionFormDefinition {
  export interface JurisdictionFormModel {
    id: string
    name: string
    jurisdictionTypeId: string
    parentJurisdictionId: string
    taxTypesToAddOrReactivate: string[]
    taxTypesToDiscontinue: string[]
  }

  export const fieldMap = new Map<keyof JurisdictionFormModel, string>(
    [
      ['name', 'Name'],
      ['jurisdictionTypeId', 'Jurisdiction Type'],
      ['parentJurisdictionId', 'Parent Jurisdiction']
    ]
  )

  export const defaultJurisdictionFormModel: JurisdictionFormModel = {
    id: '',
    name: '',
    jurisdictionTypeId: '',
    parentJurisdictionId: '',
    taxTypesToAddOrReactivate: [],
    taxTypesToDiscontinue: []
  }

  export const jurisdictionFormSchema = schema<JurisdictionFormModel>((path) => {
    required(path.name)
    required(path.jurisdictionTypeId)
  })

  export const convertToFormModel = (jurisdiction?: Jurisdiction): JurisdictionFormModel => ({
    id: jurisdiction?.id as string ?? '',
    name: jurisdiction?.name ?? '',
    jurisdictionTypeId: jurisdiction?.jurisdictionTypeId ?? '',
    parentJurisdictionId: jurisdiction?.parentJurisdictionId ?? '',
    taxTypesToAddOrReactivate: [],
    taxTypesToDiscontinue: []
  })

  export const convertToBackendModel = (formValue: JurisdictionFormModel): Partial<Jurisdiction> => ({
    id: formValue.id,
    name: formValue.name,
    jurisdictionTypeId: formValue.jurisdictionTypeId,
    parentJurisdictionId: formValue.parentJurisdictionId,
    taxTypesToAddOrReactivate: formValue.taxTypesToAddOrReactivate,
    taxTypesToDiscontinue: formValue.taxTypesToDiscontinue
  })
}
