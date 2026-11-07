import {CurrencyPipe, DatePipe} from '@angular/common'
import {Component, effect, inject, viewChild} from '@angular/core'
import {Skeleton} from 'primeng/skeleton'
import {Table, TableModule} from 'primeng/table'
import {TableLazyLoadEvent} from 'primeng/types/table'
import {Tag} from 'primeng/tag'
import {PaymentSearchResultService} from '../../../../api/location-level/payment/payment-search-result.service'
import {loadNextOnLazyLoad} from '../../../../api/util/paginated-api/paginated-lazy-load.util'
import {resetVirtualScrollOnSearch} from '../../../../utils/primeng-table.util'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../../utils/pipes/prettify-enum.pipe'
import {MoneyComponent} from '../../../reusable/money.component'
import {AutoStretchDirective} from '../../../reusable/auto-stretch.directive'
import {EmptyRowComponent} from '../../../reusable/empty-row/empty-row.component'
import {PaymentVoidStatusSeverityPipe} from './payment-void-status-severity.pipe'
import {VoidedToVoidStatusPipe} from './voided-to-void-status.pipe'

@Component({
  selector: 'rts-payments-grid',
  templateUrl: 'payments-grid.component.html',
  imports: [
    TableModule,
    Skeleton,
    Tag,
    DatePipe,
    CurrencyPipe,
    NullSafePipe,
    PrettifyEnumPipe,
    PaymentVoidStatusSeverityPipe,
    VoidedToVoidStatusPipe,
    MoneyComponent,
    AutoStretchDirective,
    EmptyRowComponent
  ]
})
export class PaymentsGridComponent {
  private readonly paymentSearchResultService = inject(PaymentSearchResultService)

  private readonly table = viewChild(Table)

  readonly payments = this.paymentSearchResultService.selectAll
  readonly loading = this.paymentSearchResultService.selectLoading

  readonly $resetScrollOnSearch = effect(() => {
    this.paymentSearchResultService.freshLoadCompleted()
    const table = this.table()
    if (table) {
      resetVirtualScrollOnSearch(table)
    }
  })

  onLazyLoad(lazyLoadEvent: TableLazyLoadEvent): void {
    loadNextOnLazyLoad(this.paymentSearchResultService, lazyLoadEvent.last)
  }
}
