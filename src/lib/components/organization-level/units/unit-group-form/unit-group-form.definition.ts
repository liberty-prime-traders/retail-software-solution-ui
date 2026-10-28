import {disabled, required, schema} from '@angular/forms/signals'
import {
  UnitGroup,
  UnitGroupCreateRequest,
  UnitGroupUpdateRequest
} from '../../../../api/organization-level/unit-group/unitgroup.model'

export namespace UnitGroupFormDefinition {
  export const DEFAULT_BASE_UNIT_NAME = 'Piece'

  export interface UnitGroupFormModel {
    id: string
    name: string
    description: string
    overrideBaseUnitName: boolean
    baseUnitName: string
    specifyBaseUnitCode: boolean
    baseUnitCode: string
  }

  export const fieldMap = new Map<keyof UnitGroupFormModel, string>(
    [
      ['name', 'Name'],
      ['description', 'Description'],
      ['baseUnitName', 'Base Unit Name'],
      ['baseUnitCode', 'Base Unit Code']
    ]
  )

  export const defaultUnitGroupFormModel: UnitGroupFormModel = {
    id: '',
    name: '',
    description: '',
    overrideBaseUnitName: false,
    baseUnitName: DEFAULT_BASE_UNIT_NAME,
    specifyBaseUnitCode: false,
    baseUnitCode: ''
  }

  export const unitGroupFormSchema = schema<UnitGroupFormModel>((path) => {
    required(path.name)

    disabled(path.baseUnitName, {when: ({valueOf}) => !valueOf(path.overrideBaseUnitName)})
    required(path.baseUnitName)

    disabled(path.baseUnitCode, {when: ({valueOf}) => !valueOf(path.specifyBaseUnitCode)})
    required(path.baseUnitCode)
  })

  export const convertToFormModel = (unitGroup?: UnitGroup): UnitGroupFormModel => ({
    ...defaultUnitGroupFormModel,
    id: unitGroup?.id as string ?? '',
    name: unitGroup?.name ?? '',
    description: unitGroup?.description ?? ''
  })

  export const convertToCreateRequest = (formValue: UnitGroupFormModel): UnitGroupCreateRequest => ({
    name: formValue.name,
    description: formValue.description,
    baseUnitName: formValue.overrideBaseUnitName ? formValue.baseUnitName : undefined,
    baseUnitCode: formValue.specifyBaseUnitCode ? formValue.baseUnitCode : undefined
  })

  export const convertToUpdateRequest = (formValue: UnitGroupFormModel): UnitGroupUpdateRequest => ({
    id: formValue.id,
    name: formValue.name,
    description: formValue.description
  })
}
