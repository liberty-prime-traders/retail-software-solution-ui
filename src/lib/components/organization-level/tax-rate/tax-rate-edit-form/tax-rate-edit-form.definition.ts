import {disabled, required, schema} from '@angular/forms/signals'
import {TaxRate} from '../../../../api/organization-level/tax-rate/tax-rate.model'
import {toLocaleDate, toLocaleDateString} from '../../../../utils/dates'

export namespace TaxRateEditFormDefinition {

  export interface TaxRateEditFormModel {
    id: string
    name: string
    endDate: Date | null
  }

  export const fieldMap = new Map<keyof TaxRateEditFormModel, string>([
    ['name', 'Name'],
    ['endDate', 'End Date'],
  ])

  export const defaultFormModel: TaxRateEditFormModel = {
    id: '',
    name: '',
    endDate: null,
  }

  export const formSchema = schema<TaxRateEditFormModel>((path) => {
    required(path.id)
    required(path.name)
    disabled(path.id, () => true)
  })

  export const convertFromRate = (rate: TaxRate): TaxRateEditFormModel => ({
    id: rate.id as string ?? '',
    name: rate.name ?? '',
    endDate: toLocaleDate(rate.endDate ?? null),
  })

  export const convertToBackendModel = (formValue: TaxRateEditFormModel): Partial<TaxRate> => ({
    id: formValue.id,
    name: formValue.name,
    endDate: toLocaleDateString(formValue.endDate),
  })
}
