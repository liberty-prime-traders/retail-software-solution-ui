import {CurrencyPipe, DatePipe} from '@angular/common'
import {Component, computed, effect, inject, viewChild} from '@angular/core'
import {ButtonDirective} from 'primeng/button'
import {Skeleton} from 'primeng/skeleton'
import {Table, TableModule} from 'primeng/table'
import {TableLazyLoadEvent} from 'primeng/types/table'
import {Tag} from 'primeng/tag'
import {SaleSearchResult} from '../../../../api/location-level/sale-summary/sale-search-result.model'
import {SaleSearchResultService} from '../../../../api/location-level/sale-summary/sale-search-result.service'
import {SaleSessionService} from '../../../../api/location-level/sale_session/sale-session.service'
import {loadNextOnLazyLoad} from '../../../../api/util/paginated-api/paginated-lazy-load.util'
import {resetVirtualScrollOnSearch} from '../../../../utils/primeng-table.util'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../../utils/pipes/prettify-enum.pipe'
import {AutoStretchDirective} from '../../../reusable/auto-stretch.directive'
import {EmptyRowComponent} from '../../../reusable/empty-row/empty-row.component'
import {PaymentStatusSeverityPipe} from '../../purchases/payment-status-severity.pipe'
import {SaleFormNavigator} from '../form-utils/sale-form-navigator'
import {SaleStatusSeverityPipe} from '../sale-status-severity.pipe'

@Component({
  selector: 'rts-sale-grid',
  templateUrl: 'sale-grid.component.html',
  imports: [
    TableModule,
    ButtonDirective,
    Tag,
    Skeleton,
    NullSafePipe,
    PrettifyEnumPipe,
    SaleStatusSeverityPipe,
    PaymentStatusSeverityPipe,
    DatePipe,
    CurrencyPipe,
    AutoStretchDirective,
    EmptyRowComponent
  ]
})
export class SaleGridComponent {
  private readonly saleSearchResultService = inject(SaleSearchResultService)
  private readonly saleSessionService = inject(SaleSessionService)
  private readonly navigator = inject(SaleFormNavigator)

  private readonly table = viewChild(Table)

  readonly sales = this.saleSearchResultService.selectAll

  readonly loading = computed(() =>
    this.saleSessionService.selectLoading() || this.saleSearchResultService.selectLoading()
  )

  readonly $resetScrollOnSearch = effect(() => {
    this.saleSearchResultService.freshLoadCompleted()
    const table = this.table()
    if (table) {
      resetVirtualScrollOnSearch(table)
    }
  })

  onLazyLoad(lazyLoadEvent: TableLazyLoadEvent): void {
    loadNextOnLazyLoad(this.saleSearchResultService, lazyLoadEvent.last)
  }

  onEditSale(sale: SaleSearchResult) {
    this.navigator.openForEditSale(sale.id)
  }
}
