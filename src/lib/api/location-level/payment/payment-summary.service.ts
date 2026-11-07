import {computed, Injectable, signal, Signal} from '@angular/core'
import {isEqual, sumBy} from 'lodash-es'
import {Subscription} from 'rxjs'
import {BaseService} from '../../util/base-api/base.service'
import {PaymentSummaryParams} from './payment-summary-params.model'
import {PaymentSummary} from './payment-summary.model'
import {PaymentSummaryStore} from './payment-summary.store'

@Injectable({providedIn: 'root'})
export class PaymentSummaryService extends BaseService<PaymentSummary, PaymentSummaryParams> {

  readonly paymentSummary: Signal<PaymentSummary|undefined> = this.selectFirst
  readonly activePaymentsCount = computed(() =>
    sumBy(this.paymentSummary()?.summaries ?? [], summary => summary.activeCount)
  )
  readonly voidedPaymentsCount = computed(() =>
    sumBy(this.paymentSummary()?.summaries ?? [], summary => summary.voidedCount)
  )

  private readonly previousFilterParams = signal<PaymentSummaryParams | null>(null)

  constructor(protected override readonly store: PaymentSummaryStore) {
    super(store)
  }

  override refetch(params: PaymentSummaryParams): Subscription | undefined {
    if (isEqual(this.previousFilterParams(), params)) {
      return undefined
    }
    this.previousFilterParams.set(params)
    this.resetStoreAndClearCache()
    return this.postRequest({body: params})
  }
}
