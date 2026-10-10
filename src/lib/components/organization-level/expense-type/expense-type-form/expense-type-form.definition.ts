import {minLength, required, schema} from '@angular/forms/signals'
import {ExpenseSourceType} from '../../../../api/cross-tier/expense/expense-source-type.enum'
import {ContactType} from '../../../../api/organization-level/contact/contact-type.enum'
import {ExpenseType} from '../../../../api/organization-level/expense-type/expense-type.model'

export namespace ExpenseTypeFormDefinition {
  export interface ExpenseTypeFormModel {
    id: string
    name: string
    expenseAccountCode: string
    eligiblePayeeTypes: ContactType[]
    eligibleSourceTypes: ExpenseSourceType[]
    systemDefined: boolean
  }

  export const fieldMap = new Map<keyof ExpenseTypeFormModel, string>(
    [
      ['name', 'Name'],
      ['expenseAccountCode', 'Expense Account'],
      ['eligiblePayeeTypes', 'Eligible Payee Types'],
      ['eligibleSourceTypes', 'Eligible Source Types']
    ]
  )

  export const defaultExpenseTypeFormModel: ExpenseTypeFormModel = {
    id: '',
    name: '',
    expenseAccountCode: '',
    eligiblePayeeTypes: [],
    eligibleSourceTypes: [],
    systemDefined: false
  }

  export const expenseTypeFormSchema = schema<ExpenseTypeFormModel>((path) => {
    required(path.name)
    required(path.expenseAccountCode)
    minLength(path.eligiblePayeeTypes, 1)
    minLength(path.eligibleSourceTypes, 1)
  })

  export const convertToFormModel = (expenseType?: ExpenseType): ExpenseTypeFormModel => ({
    id: expenseType?.id as string ?? '',
    name: expenseType?.name ?? '',
    expenseAccountCode: expenseType?.expenseAccountCode ?? '',
    eligiblePayeeTypes: expenseType?.eligiblePayeeTypes ?? [],
    eligibleSourceTypes: expenseType?.eligibleSourceTypes ?? [],
    systemDefined: expenseType?.systemDefined ?? false
  })

  export const convertToBackendModel = (formValue: ExpenseTypeFormModel): Partial<ExpenseType> => ({
    id: formValue.id || undefined,
    name: formValue.name,
    expenseAccountCode: formValue.expenseAccountCode,
    eligiblePayeeTypes: formValue.eligiblePayeeTypes,
    eligibleSourceTypes: formValue.eligibleSourceTypes
  })
}
