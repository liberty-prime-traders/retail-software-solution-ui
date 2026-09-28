import {CurrencyPipe, DatePipe} from '@angular/common'
import {Component, effect, inject, viewChild} from '@angular/core'
import {Skeleton} from 'primeng/skeleton'
import {Table, TableModule} from 'primeng/table'
import {TableLazyLoadEvent} from 'primeng/types/table'
import {Tag} from 'primeng/tag'
import {SalePaymentSearchResultService} from '../../../api/location-level/sale-payment/sale-payment-search-result.service'
import {loadNextOnLazyLoad} from '../../../api/util/paginated-api/paginated-lazy-load.util'
import {resetVirtualScrollOnSearch} from '../../../utils/primeng-table.util'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../utils/pipes/prettify-enum.pipe'
import {AutoStretchDirective} from '../../reusable/auto-stretch.directive'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {SalePaymentStatusSeverityPipe} from './sale-payment-status-severity.pipe'

@Component({
  selector: 'rts-sale-payments-summary-grid',
  templateUrl: 'sale-payments-summary-grid.component.html',
  imports: [
    TableModule,
    Skeleton,
    Tag,
    DatePipe,
    CurrencyPipe,
    NullSafePipe,
    PrettifyEnumPipe,
    SalePaymentStatusSeverityPipe,
    AutoStretchDirective,
    EmptyRowComponent
  ]
})
export class SalePaymentsSummaryGridComponent {
  private readonly salePaymentSearchResultService = inject(SalePaymentSearchResultService)

  private readonly table = viewChild(Table)

  readonly payments = this.salePaymentSearchResultService.selectAll
  readonly loading = this.salePaymentSearchResultService.selectLoading

  readonly $resetScrollOnSearch = effect(() => {
    this.salePaymentSearchResultService.freshLoadCompleted()
    const table = this.table()
    if (table) {
      resetVirtualScrollOnSearch(table)
    }
  })

  onLazyLoad(lazyLoadEvent: TableLazyLoadEvent): void {
    loadNextOnLazyLoad(this.salePaymentSearchResultService, lazyLoadEvent.last)
  }
}
