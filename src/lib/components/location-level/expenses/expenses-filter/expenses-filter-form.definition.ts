import {schema} from '@angular/forms/signals'
import {ExpenseSearchParameters} from '../../../../api/cross-tier/expense/expense-search-parameters.model'
import {ExpenseVoidedState} from '../../../../api/cross-tier/expense/expense-voided-state.enum'
import {PaymentStatus} from '../../../../api/location-level/purchase/payment-status.enum'
import {getToday, toLocaleDateString} from '../../../../utils/dates'
import {ZonedDatesService} from '../../../../utils/services/zoned-dates.service'

export namespace ExpensesFilterFormDefinition {
  export interface ExpensesFilterFormModel {
    createdFrom: Date | null
    createdBefore: Date | null
    expenseDateFrom: Date | null
    expenseDateBefore: Date | null
    payeeContactIds: string[]
    expenseTypeIds: string[]
    paymentMethodIds: string[]
    paymentStatuses: PaymentStatus[]
    voidedStates: ExpenseVoidedState[]
    minAmount: number | null
    maxAmount: number | null
    sourceReferences: string[]
  }

  export const MAX_SOURCE_REFERENCES = 20

  export const createDefaultExpensesFilterFormModel = (): ExpensesFilterFormModel => {
    const tomorrow = getToday()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const sevenDaysAgo = getToday()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    return {
      createdFrom: sevenDaysAgo,
      createdBefore: tomorrow,
      expenseDateFrom: null,
      expenseDateBefore: null,
      payeeContactIds: [],
      expenseTypeIds: [],
      paymentMethodIds: [],
      paymentStatuses: [],
      voidedStates: [],
      minAmount: null,
      maxAmount: null,
      sourceReferences: []
    }
  }

  export const expensesFilterFormSchema = schema<ExpensesFilterFormModel>(() => {})

  // Both or neither checked means no voided restriction.
  const toVoidedParam = (voidedStates: ExpenseVoidedState[]): boolean | undefined => {
    if (voidedStates.length !== 1) {
      return undefined
    }
    return voidedStates[0] === ExpenseVoidedState.VOIDED
  }

  export const convertToFilterParams = (
    formValue: ExpensesFilterFormModel, zonedDatesService: ZonedDatesService
  ): ExpenseSearchParameters => ({
    createdFrom: zonedDatesService.atOrgZone(formValue.createdFrom) || undefined,
    createdBefore: zonedDatesService.atOrgZone(formValue.createdBefore) || undefined,
    expenseDateFrom: toLocaleDateString(formValue.expenseDateFrom) || undefined,
    expenseDateBefore: toLocaleDateString(formValue.expenseDateBefore) || undefined,
    payeeContactIds: formValue.payeeContactIds.length ? formValue.payeeContactIds : undefined,
    expenseTypeIds: formValue.expenseTypeIds.length ? formValue.expenseTypeIds : undefined,
    sourceReferences: formValue.sourceReferences.length ? formValue.sourceReferences : undefined,
    paymentMethodIds: formValue.paymentMethodIds.length ? formValue.paymentMethodIds : undefined,
    paymentStatuses: formValue.paymentStatuses.length ? formValue.paymentStatuses : undefined,
    voided: toVoidedParam(formValue.voidedStates),
    minAmount: formValue.minAmount ?? undefined,
    maxAmount: formValue.maxAmount ?? undefined
  })
}
