import {computed, Injectable, signal, Signal} from '@angular/core'
import {isEqual} from 'lodash-es'
import {Subscription} from 'rxjs'
import {BaseService} from '../../util/base-api/base.service'
import {SaleSearchParameters} from './sale-search-parameters.model'
import {SaleSearchSummary} from './sale-search-summary.model'
import {SaleSearchSummaryStore} from './sale-search-summary.store'

@Injectable({providedIn: 'root'})
export class SaleSearchSummaryService extends BaseService<SaleSearchSummary, SaleSearchParameters> {

  readonly saleSearchSummary: Signal<SaleSearchSummary | undefined> = this.selectFirst
  readonly saleCount = computed(() => this.saleSearchSummary()?.saleCount ?? 0)

  private readonly previousFilterParams = signal<SaleSearchParameters | null>(null)

  constructor(protected override readonly store: SaleSearchSummaryStore) {
    super(store)
  }

  override refetch(params: SaleSearchParameters): Subscription | undefined {
    if (isEqual(this.previousFilterParams(), params)) {
      return undefined
    }
    this.previousFilterParams.set(params)
    this.resetStoreAndClearCache()
    return this.postRequest({body: params})
  }

  forceRefetch(params: SaleSearchParameters): Subscription {
    this.previousFilterParams.set(null)
    return this.refetch(params) as Subscription
  }
}
