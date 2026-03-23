import {disabled, minLength, required, schema} from '@angular/forms/signals'
import {TaxApplicationLevel} from '../../../../api/platform-level/tax-type/tax-application-level.enum'
import {TaxRecoveryType} from '../../../../api/platform-level/tax-type/tax-recovery-type.enum'
import {TaxTrigger} from '../../../../api/platform-level/tax-type/tax-trigger.enum'
import {CalculationMethod} from '../../../../api/platform-level/tax-type/calculation-method.enum'
import {TaxType} from '../../../../api/platform-level/tax-type/tax-type.model'

export namespace TaxTypeFormDefinition {
  export interface TaxTypeFormModel {
    id: string
    name: string
    description: string
    calculationMethod: CalculationMethod | ''
    taxRecoveryType: TaxRecoveryType | ''
    taxApplicationLevel: TaxApplicationLevel | ''
    taxTriggers: TaxTrigger[]
  }

  export const fieldMap = new Map<keyof TaxTypeFormModel, string>(
    [
      ['name', 'Name'],
      ['description', 'Description'],
      ['calculationMethod', 'Calculation Method'],
      ['taxRecoveryType', 'Tax Recovery Type'],
      ['taxApplicationLevel', 'Tax Application Level']
    ]
  )

  export const defaultTaxTypeFormModel: TaxTypeFormModel = {
    id: '',
    name: '',
    description: '',
    calculationMethod: '',
    taxRecoveryType: '',
    taxApplicationLevel: '',
    taxTriggers: []
  }

  export const taxTypeFormSchema = schema<TaxTypeFormModel>((path) => {
    required(path.name)
    required(path.calculationMethod)
    disabled(path.calculationMethod, ({valueOf}) => !!valueOf(path.id))
    required(path.taxRecoveryType)
    required(path.taxApplicationLevel)
    minLength(path.taxTriggers, 1, {message: 'At least one tax trigger must be selected.'})
  })

  export const convertToFormModel = (taxType?: TaxType): TaxTypeFormModel => ({
    id: taxType?.id as string ?? '',
    name: taxType?.name ?? '',
    description: taxType?.description ?? '',
    calculationMethod: taxType?.calculationMethod ?? '',
    taxRecoveryType: taxType?.taxRecoveryType ?? '',
    taxApplicationLevel: taxType?.taxApplicationLevel ?? '',
    taxTriggers: taxType?.taxTriggers ?? []
  })

  export const convertToBackendModel = (formValue: TaxTypeFormModel): Partial<TaxType> => ({
    id: formValue.id,
    name: formValue.name,
    description: formValue.description,
    calculationMethod: formValue.calculationMethod as CalculationMethod,
    taxRecoveryType: formValue.taxRecoveryType as TaxRecoveryType,
    taxApplicationLevel: formValue.taxApplicationLevel as TaxApplicationLevel,
    taxTriggers: formValue.taxTriggers
  })
}
