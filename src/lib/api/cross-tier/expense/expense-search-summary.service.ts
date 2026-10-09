import {computed, Injectable, signal, Signal} from '@angular/core'
import {isEqual} from 'lodash-es'
import {Subscription} from 'rxjs'
import {BaseService} from '../../util/base-api/base.service'
import {ExpenseSearchParameters} from './expense-search-parameters.model'
import {ExpenseSearchSummary} from './expense-search-summary.model'
import {ExpenseSearchSummaryStore} from './expense-search-summary.store'

@Injectable({providedIn: 'root'})
export class ExpenseSearchSummaryService extends BaseService<ExpenseSearchSummary, ExpenseSearchParameters> {

  readonly expenseSearchSummary: Signal<ExpenseSearchSummary | undefined> = this.selectFirst
  readonly expenseCount = computed(() => (this.expenseSearchSummary()?.expenseCount ?? 0)
    + (this.expenseSearchSummary()?.voidedCount ?? 0))

  private readonly previousFilterParams = signal<ExpenseSearchParameters | null>(null)

  constructor(protected override readonly store: ExpenseSearchSummaryStore) {
    super(store)
  }

  override refetch(params: ExpenseSearchParameters): Subscription | undefined {
    if (isEqual(this.previousFilterParams(), params)) {
      return undefined
    }
    this.previousFilterParams.set(params)
    this.resetStoreAndClearCache()
    return this.postRequest({body: params})
  }

  forceRefetch(params: ExpenseSearchParameters): Subscription {
    this.previousFilterParams.set(null)
    return this.refetch(params) as Subscription
  }
}
