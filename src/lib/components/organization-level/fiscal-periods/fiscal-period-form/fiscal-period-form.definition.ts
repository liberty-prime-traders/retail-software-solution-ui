import {required, schema} from '@angular/forms/signals'
import {FiscalPeriod} from '../../../../api/organization-level/fiscal-period/fiscal-period.model'

export namespace FiscalPeriodFormDefinition {
  export interface FormModel {
    id: string
    name: string
  }

  export const fieldMap = new Map<keyof FormModel, string>([
    ['name', 'Name']
  ])

  export const defaultFormModel: FormModel = {
    id: '',
    name: ''
  }

  export const formSchema = schema<FormModel>((path) => {
    required(path.name)
  })

  export const convertToFormModel = (period?: FiscalPeriod): FormModel => ({
    id: period?.id as string ?? '',
    name: period?.name ?? ''
  })
}
