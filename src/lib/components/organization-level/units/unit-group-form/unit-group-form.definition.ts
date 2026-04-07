import {required, schema} from '@angular/forms/signals'
import {UnitGroup} from '../../../../api/organization-level/unit-group/unitgroup.model'

export namespace UnitGroupFormDefinition {
  export interface UnitGroupFormModel {
    id: string
    name: string
    description: string
  }

  export const fieldMap = new Map<keyof UnitGroupFormModel, string>(
    [
      ['name', 'Name'],
      ['description', 'Description']
    ]
  )

  export const defaultUnitGroupFormModel: UnitGroupFormModel = {
    id: '',
    name: '',
    description: ''
  }

  export const unitGroupFormSchema = schema<UnitGroupFormModel>(path => {
    required(path.name)
  })

  export const convertToFormModel = (unitGroup?: UnitGroup): UnitGroupFormModel => ({
    id: unitGroup?.id as string ?? '',
    name: unitGroup?.name ?? '',
    description: unitGroup?.description ?? ''
  })

  export const convertToBackendModel = (
    formValue: UnitGroupFormModel
  ): Partial<UnitGroup> => ({
    id: formValue.id || undefined,
    name: formValue.name,
    description: formValue.description
  })
}
