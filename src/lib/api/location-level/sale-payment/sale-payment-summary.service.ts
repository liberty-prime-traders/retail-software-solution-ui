import {computed, Injectable, signal, Signal} from '@angular/core'
import {isEqual} from 'lodash-es'
import {Subscription} from 'rxjs'
import {BaseService} from '../../util/base-api/base.service'
import {SalePaymentSummaryParams} from './sale-payment-summary-params.model'
import {SalePaymentSummary} from './sale-payment-summary.model'
import {SalePaymentSummaryStore} from './sale-payment-summary.store'

@Injectable({providedIn: 'root'})
export class SalePaymentSummaryService extends BaseService<SalePaymentSummary, SalePaymentSummaryParams> {

  readonly salePaymentSummary: Signal<SalePaymentSummary|undefined> = this.selectFirst
  readonly activePaymentsCount = computed(() => this.salePaymentSummary()?.activeCount ?? 0)
  readonly voidedPaymentsCount = computed(() => this.salePaymentSummary()?.voidedCount ?? 0)

  private readonly previousFilterParams = signal<SalePaymentSummaryParams | null>(null)

  constructor(protected override readonly store: SalePaymentSummaryStore) {
    super(store)
  }

  override refetch(params: SalePaymentSummaryParams): Subscription | undefined {
    if (isEqual(this.previousFilterParams(), params)) {
      return undefined
    }
    this.previousFilterParams.set(params)
    this.resetStoreAndClearCache()
    return this.postRequest({body: params})
  }
}
