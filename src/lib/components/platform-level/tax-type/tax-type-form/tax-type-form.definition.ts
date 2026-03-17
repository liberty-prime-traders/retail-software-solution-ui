import {disabled, required, schema} from '@angular/forms/signals'
import {CalculationMethod} from '../../../../api/platform-level/tax-type/calculation-method.enum'
import {TaxType} from '../../../../api/platform-level/tax-type/tax-type.model'

export namespace TaxTypeFormDefinition {
  export interface TaxTypeFormModel {
    id: string
    name: string
    description: string
    calculationMethod: CalculationMethod | ''
  }

  export const fieldMap = new Map<keyof TaxTypeFormModel, string>(
    [
      ['name', 'Name'],
      ['description', 'Description'],
      ['calculationMethod', 'Calculation Method']
    ]
  )

  export const defaultTaxTypeFormModel: TaxTypeFormModel = {
    id: '',
    name: '',
    description: '',
    calculationMethod: ''
  }

  export const taxTypeFormSchema = schema<TaxTypeFormModel>((path) => {
    required(path.name)
    required(path.calculationMethod)
    disabled(path.calculationMethod, ({valueOf}) => !!valueOf(path.id))
  })

  export const convertToFormModel = (taxType?: TaxType): TaxTypeFormModel => ({
    id: taxType?.id as string ?? '',
    name: taxType?.name ?? '',
    description: taxType?.description ?? '',
    calculationMethod: taxType?.calculationMethod ?? ''
  })

  export const convertToBackendModel = (formValue: TaxTypeFormModel): Partial<TaxType> => ({
    id: formValue.id,
    name: formValue.name,
    description: formValue.description,
    calculationMethod: formValue.calculationMethod as CalculationMethod
  })
}
