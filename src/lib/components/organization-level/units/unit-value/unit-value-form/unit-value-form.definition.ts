import {required, schema} from '@angular/forms/signals'
import {isNil} from 'lodash-es'
import {UnitValue} from '../../../../../api/organization-level/unit-value/unitvalue.model'

export namespace UnitValueFormDefinition {
  export interface UnitValueFormModel {
    id: string
    name: string
    code: string
    description: string
    baseUnit: string | null
    unitsOfBasePerUnit: number | null
  }

  export const fieldMap = new Map<keyof UnitValueFormModel, string>(
    [
      ['name', 'Name'],
      ['code', 'Code'],
      ['description', 'Description'],
      ['baseUnit', 'Base Unit'],
      ['unitsOfBasePerUnit', 'Multiplier']
    ]
  )

  export const defaultUnitValueFormModel: UnitValueFormModel = {
    id: '',
    name: '',
    code: '',
    description: '',
    baseUnit: null,
    unitsOfBasePerUnit: null
  }

  export const unitValueFormSchema = schema<UnitValueFormModel>((path) => {
    required(path.name)
    required(path.code)
    required(path.baseUnit, {when: ({valueOf}) => !isNil(valueOf(path.unitsOfBasePerUnit))})
    required(path.unitsOfBasePerUnit, {when: ({valueOf}) => !isNil(valueOf(path.baseUnit))})
  })

  export const convertToFormModel = (unitValue?: UnitValue): UnitValueFormModel => ({
    id: unitValue?.id as string ?? '',
    name: unitValue?.name ?? '',
    code: unitValue?.code ?? '',
    description: unitValue?.description ?? '',
    baseUnit: unitValue?.baseUnit ?? null,
    unitsOfBasePerUnit: unitValue?.unitsOfBasePerUnit ?? null
  })

  export const convertToBackendModel = (formValue: UnitValueFormModel): Partial<UnitValue> => ({
    id: formValue.id || undefined,
    name: formValue.name,
    code: formValue.code,
    description: formValue.description || undefined,
    baseUnit: formValue.baseUnit ?? undefined,
    unitsOfBasePerUnit: formValue.unitsOfBasePerUnit ?? undefined
  })
}
