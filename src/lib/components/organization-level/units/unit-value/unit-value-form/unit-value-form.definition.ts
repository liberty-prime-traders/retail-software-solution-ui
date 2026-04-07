import {required, schema} from '@angular/forms/signals'
import {UnitValue} from '../../../../../api/organization-level/unit-value/unitvalue.model'

export namespace UnitValueFormDefinition {
  export interface UnitValueFormModel {
    id: string
    name: string
    code: string
    description: string
    baseUnit: string
    conversionFactor: number | null
  }

  export const fieldMap = new Map<keyof UnitValueFormModel, string>(
    [
      ['name', 'Name'],
      ['code', 'Code'],
      ['description', 'Description'],
      ['baseUnit', 'Base Unit'],
      ['conversionFactor', 'Multiplier']
    ]
  )

  export const defaultUnitValueFormModel: UnitValueFormModel = {
    id: '',
    name: '',
    code: '',
    description: '',
    baseUnit: '',
    conversionFactor: null
  }

  export const unitValueFormSchema = schema<UnitValueFormModel>(path => {
    required(path.name)
    required(path.code)
  })

  /**
   * Matches previous reactive FormGroup validator: base unit and multiplier must both be set or both empty.
   */

  export const isBaseUnitConversionPairValid = (
    m: Pick<UnitValueFormModel, 'baseUnit' | 'conversionFactor'>
  ): boolean => {
    const baseEmpty =
      m.baseUnit === null || m.baseUnit === undefined || m.baseUnit === ''
    const convEmpty =
      m.conversionFactor === null || m.conversionFactor === undefined
    if (baseEmpty && convEmpty) {
      return true
    }
    return !baseEmpty && !convEmpty
  }

  export const convertToFormModel = (unitValue?: UnitValue): UnitValueFormModel => ({
    id: unitValue?.id as string ?? '',
    name: unitValue?.name ?? '',
    code: unitValue?.code ?? '',
    description: unitValue?.description ?? '',
    baseUnit: unitValue?.baseUnit ?? '',
    conversionFactor: unitValue?.conversionFactor ?? null
  })

  export const convertToBackendModel = (
    formValue: UnitValueFormModel
  ): Partial<UnitValue> => ({
    id: formValue.id || undefined,
    name: formValue.name,
    code: formValue.code,
    description: formValue.description,
    baseUnit: formValue.baseUnit || undefined,
    conversionFactor: formValue.conversionFactor ?? undefined
  })
}
