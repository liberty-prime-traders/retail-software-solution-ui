import {computed, effect, inject, Injectable, signal, untracked} from '@angular/core'
import {form} from '@angular/forms/signals'
import {ExpenseSearchSummaryService} from '../../../../api/cross-tier/expense/expense-search-summary.service'
import {ExpenseSearchResultService} from '../../../../api/cross-tier/expense/expense-search-result.service'
import {ExpenseService} from '../../../../api/cross-tier/expense/expense.service'
import {ContactService} from '../../../../api/organization-level/contact/contact.service'
import {ExpenseTypeService} from '../../../../api/organization-level/expense-type/expense-type.service'
import {PaymentOptionService} from '../../../../api/organization-level/payment-option/payment-option.service'
import {PrettifyEnumPipe} from '../../../../utils/pipes/prettify-enum.pipe'
import {ZonedDatesService} from '../../../../utils/services/zoned-dates.service'
import {debouncedSignal, runOnSignalChange} from '../../../../utils/signals'
import {ExpensesFilterFormDefinition} from './expenses-filter-form.definition'

@Injectable({providedIn: 'root'})
export class ExpensesFilterState {
  private readonly contactService = inject(ContactService)
  private readonly expenseTypeService = inject(ExpenseTypeService)
  private readonly paymentOptionService = inject(PaymentOptionService)
  private readonly expenseService = inject(ExpenseService)
  private readonly expenseSearchResultService = inject(ExpenseSearchResultService)
  private readonly expenseSearchSummaryService = inject(ExpenseSearchSummaryService)
  private readonly zonedDatesService = inject(ZonedDatesService)

  readonly maxSourceReferences = ExpensesFilterFormDefinition.MAX_SOURCE_REFERENCES

  readonly payees = this.contactService.selectAll
  readonly expenseTypes = this.expenseTypeService.selectAll
  readonly paymentMethods = this.paymentOptionService.selectAll

  readonly filterFormValue = signal(ExpensesFilterFormDefinition.createDefaultExpensesFilterFormModel())
  readonly filterForm = form(this.filterFormValue, ExpensesFilterFormDefinition.expensesFilterFormSchema)

  readonly payeeNames = computed(() => {
    const namesById = new Map(this.payees().map(payee => [payee.id, payee.fullName]))
    return this.filterFormValue().payeeContactIds
      .map(id => namesById.get(id))
      .filter((name): name is string => !!name)
  })

  readonly expenseTypeNames = computed(() => {
    const namesById = new Map(this.expenseTypes().map(expenseType => [expenseType.id, expenseType.name]))
    return this.filterFormValue().expenseTypeIds
      .map(id => namesById.get(id))
      .filter((name): name is string => !!name)
  })

  readonly paymentMethodNames = computed(() => {
    const namesById = new Map(this.paymentMethods().map(paymentMethod => [paymentMethod.id, paymentMethod.name]))
    return this.filterFormValue().paymentMethodIds
      .map(id => namesById.get(id))
      .filter((name): name is string => !!name)
  })

  readonly paymentStatusLabels = computed(() =>
    this.filterFormValue().paymentStatuses.map(status => PrettifyEnumPipe.prototype.transform(status))
  )

  readonly voidedStateLabels = computed(() =>
    this.filterFormValue().voidedStates.map(state => PrettifyEnumPipe.prototype.transform(state))
  )

  private readonly debouncedFilterFormValue = debouncedSignal(this.filterFormValue, 1500)

  readonly filterParams = computed(() =>
    ExpensesFilterFormDefinition.convertToFilterParams(this.debouncedFilterFormValue(), this.zonedDatesService)
  )

  private readonly refetchSummaryOnFilterChange = effect(() => {
    const filterParams = this.filterParams()
    untracked(() => this.expenseSearchSummaryService.refetch(filterParams))
  })

  private readonly refreshOnExpenseMutation = runOnSignalChange(
    this.expenseService.mutationCount,
    () => this.refreshResults()
  )

  addSourceReferences(rawValue: string) {
    const candidates = rawValue.split(/[\n,]/).map(value => value.trim()).filter(Boolean)
    if (candidates.length === 0) {
      return
    }

    const sourceReferences = this.filterForm.sourceReferences().value
    const merged = Array.from(new Set([...sourceReferences(), ...candidates])).slice(0, this.maxSourceReferences)
    sourceReferences.set(merged)
  }

  removeSourceReference(reference: string) {
    const sourceReferences = this.filterForm.sourceReferences().value
    sourceReferences.set(sourceReferences().filter(value => value !== reference))
  }

  resetFilters() {
    this.filterFormValue.set(ExpensesFilterFormDefinition.createDefaultExpensesFilterFormModel())
  }

  refreshResults() {
    const filterParams = this.filterParams()
    this.expenseSearchResultService.forceRefetch(filterParams)
    this.expenseSearchSummaryService.forceRefetch(filterParams)
  }
}
