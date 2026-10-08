import {applyEach, min, required, schema, SchemaPathTree} from '@angular/forms/signals'
import {SelectItem} from 'primeng/api'
import {ExpenseSourceType} from '../../../../api/cross-tier/expense/expense-source-type.enum'
import {
  PaymentInstruction,
  StandaloneExpenseBatchRequest,
  StandaloneExpenseRowRequest,
  WageExpenseBatchRequest,
  WageExpenseRowRequest
} from '../../../../api/cross-tier/expense/expense.model'
import {getToday, getTodayStr, toLocaleDateString} from '../../../../utils/dates'

export namespace ExpenseBatchFormDefinition {
  export type BatchType = ExpenseSourceType.ADHOC | ExpenseSourceType.WAGES

  export interface ExpenseRowModel {
    payeeContactId: string
    expenseTypeId: string
    amount: number | null
    description: string
    expenseDate: Date | null
    payNow: boolean
    paymentMethodId: string
    paymentReference: string
    paymentDate: Date | null
  }

  export interface ExpenseBatchModel {
    batchType: BatchType
    grouped: boolean
    description: string
    expenseDate: Date | null
    rows: ExpenseRowModel[]
  }

  export const batchTypeOptions: SelectItem<BatchType>[] = [
    {label: 'Wages', value: ExpenseSourceType.WAGES},
    {label: 'Ad-hoc', value: ExpenseSourceType.ADHOC},
  ]

  export const createDefaultRow = (batchType: BatchType): ExpenseRowModel => ({
    payeeContactId: '',
    expenseTypeId: '',
    amount: null,
    description: '',
    expenseDate: batchType === ExpenseSourceType.ADHOC ? getToday() : null,
    payNow: false,
    paymentMethodId: '',
    paymentReference: '',
    paymentDate: getToday()
  })

  export const createDefaultModel = (batchType: BatchType = ExpenseSourceType.WAGES): ExpenseBatchModel => ({
    batchType,
    grouped: false,
    description: '',
    expenseDate: getToday(),
    rows: [createDefaultRow(batchType)]
  })

  export const isAdhoc = (model: ExpenseBatchModel) => model.batchType === ExpenseSourceType.ADHOC
  export const isWages = (model: ExpenseBatchModel) => model.batchType === ExpenseSourceType.WAGES
  export const isGrouped = (model: ExpenseBatchModel) => isWages(model) || model.grouped

  export const batchSchema = schema<ExpenseBatchModel>((path) => {
    applyEach(path.rows, createRowSchema(path))
    required(path.description, {
      when: ({valueOf}) => valueOf(path.batchType) === ExpenseSourceType.ADHOC && valueOf(path.grouped)
    })
    required(path.expenseDate, {when: ({valueOf}) => valueOf(path.batchType) === ExpenseSourceType.WAGES})
  })

  const createRowSchema = (batchSchema: SchemaPathTree<ExpenseBatchModel>) => schema<ExpenseRowModel>((path) => {
    required(path.payeeContactId)
    required(path.amount)
    min(path.amount, 0.01)
    required(path.paymentMethodId, {when: ({valueOf}) => valueOf(path.payNow)})
    required(path.paymentDate, {when: ({valueOf}) => valueOf(path.payNow)})

    required(path.expenseTypeId, {when: ({valueOf}) => valueOf(batchSchema.batchType) === ExpenseSourceType.ADHOC})
    required(path.expenseDate, {when: ({valueOf}) => valueOf(batchSchema.batchType) === ExpenseSourceType.ADHOC})
    required(path.description, {
      when: ({valueOf}) => valueOf(batchSchema.batchType) === ExpenseSourceType.ADHOC && !valueOf(batchSchema.grouped)
    })
  })

  export const convertToStandaloneRequest = (model: ExpenseBatchModel): StandaloneExpenseBatchRequest => ({
    description: model.grouped ? model.description : model.rows[0].description,
    expenseDate: getTodayStr(),
    rows: model.rows.map(convertStandaloneRow)
  })

  const convertStandaloneRow = (row: ExpenseRowModel): StandaloneExpenseRowRequest => ({
    payeeContactId: row.payeeContactId,
    expenseTypeId: row.expenseTypeId,
    amount: row.amount!,
    description: row.description || undefined,
    expenseDateOverride: toLocaleDateString(row.expenseDate),
    settlement: convertSettlement(row)
  })

  const convertSettlement = (row: ExpenseRowModel): PaymentInstruction | undefined => {
    if(!row.payNow) {
      return undefined
    }
    return {
      paymentMethodId: row.paymentMethodId,
      paymentReference: row.paymentReference || undefined,
      paymentDate: toLocaleDateString(row.paymentDate)
    }
  }

  export const convertToWageRequest = (model: ExpenseBatchModel): WageExpenseBatchRequest => ({
    expenseDate: toLocaleDateString(model.expenseDate),
    rows: model.rows.map(convertWageRow)
  })

  const convertWageRow = (row: ExpenseRowModel): WageExpenseRowRequest => ({
    employeeContactId: row.payeeContactId,
    amount: row.amount!,
    expenseDateOverride: row.expenseDate ? toLocaleDateString(row.expenseDate) : undefined,
    settlement: convertSettlement(row)
  })

}
