import {min, required, schema} from '@angular/forms/signals'

export namespace ContactOpeningBalanceEditDefinition {
  export interface FormModel {
    payable: number | null
    receivable: number | null
  }

  export const fieldMap = new Map<keyof FormModel, string>([
    ['payable', 'We owed them'],
    ['receivable', 'They owed us']
  ])

  export const defaultFormModel: FormModel = {
    payable: 0,
    receivable: 0
  }

  export const formSchema = schema<FormModel>(path => {
    required(path.payable)
    required(path.receivable)
    min(path.payable, 0)
    min(path.receivable, 0)
  })
}
