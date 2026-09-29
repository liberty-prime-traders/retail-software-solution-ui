import {computed, Injectable, signal, Signal} from '@angular/core'
import {isEqual} from 'lodash-es'
import {Subscription} from 'rxjs'
import {BaseService} from '../../util/base-api/base.service'
import {PurchaseSearchParameters} from './purchase-search-parameters.model'
import {PurchaseSearchSummary} from './purchase-search-summary.model'
import {PurchaseSearchSummaryStore} from './purchase-search-summary.store'

@Injectable({providedIn: 'root'})
export class PurchaseSearchSummaryService extends BaseService<PurchaseSearchSummary, PurchaseSearchParameters> {

  readonly purchaseSearchSummary: Signal<PurchaseSearchSummary | undefined> = this.selectFirst
  readonly purchaseCount = computed(() => this.purchaseSearchSummary()?.purchaseCount ?? 0)

  private readonly previousFilterParams = signal<PurchaseSearchParameters | null>(null)

  constructor(protected override readonly store: PurchaseSearchSummaryStore) {
    super(store)
  }

  override refetch(params: PurchaseSearchParameters): Subscription | undefined {
    if (isEqual(this.previousFilterParams(), params)) {
      return undefined
    }
    this.previousFilterParams.set(params)
    this.resetStoreAndClearCache()
    return this.postRequest({body: params})
  }

  forceRefetch(params: PurchaseSearchParameters): Subscription {
    this.previousFilterParams.set(null)
    return this.refetch(params) as Subscription
  }
}
