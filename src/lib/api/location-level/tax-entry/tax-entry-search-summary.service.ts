import {computed, Injectable, signal, Signal} from '@angular/core'
import {isEqual} from 'lodash-es'
import {Subscription} from 'rxjs'
import {BaseService} from '../../util/base-api/base.service'
import {TaxEntrySearchParameters} from './tax-entry-search-parameters.model'
import {TaxEntrySearchSummary} from './tax-entry-search-summary.model'
import {TaxEntrySearchSummaryStore} from './tax-entry-search-summary.store'

@Injectable({providedIn: 'root'})
export class TaxEntrySearchSummaryService extends BaseService<TaxEntrySearchSummary, TaxEntrySearchParameters> {

  readonly taxEntrySearchSummary: Signal<TaxEntrySearchSummary | undefined> = this.selectFirst
  readonly entryCount = computed(() => this.taxEntrySearchSummary()?.entryCount ?? 0)

  private readonly previousFilterParams = signal<TaxEntrySearchParameters | null>(null)

  constructor(protected override readonly store: TaxEntrySearchSummaryStore) {
    super(store)
  }

  override refetch(params: TaxEntrySearchParameters): Subscription | undefined {
    if (isEqual(this.previousFilterParams(), params) || !params.fiscalPeriodIds?.length) {
      return undefined
    }
    this.previousFilterParams.set(params)
    this.resetStoreAndClearCache()
    return this.postRequest({body: params})
  }
}
