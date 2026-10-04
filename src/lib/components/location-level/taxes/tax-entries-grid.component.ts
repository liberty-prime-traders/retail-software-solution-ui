import {CurrencyPipe, DatePipe, DecimalPipe} from '@angular/common'
import {Component, computed, effect, inject, viewChild} from '@angular/core'
import {Skeleton} from 'primeng/skeleton'
import {Table, TableModule} from 'primeng/table'
import {Tag} from 'primeng/tag'
import {TableLazyLoadEvent} from 'primeng/types/table'
import {TaxEntrySearchResultService} from '../../../api/location-level/tax-entry/tax-entry-search-result.service'
import {loadNextOnLazyLoad} from '../../../api/util/paginated-api/paginated-lazy-load.util'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../utils/pipes/prettify-enum.pipe'
import {resetVirtualScrollOnSearch} from '../../../utils/primeng-table.util'
import {AutoStretchDirective} from '../../reusable/auto-stretch.directive'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {TaxRatePipe} from './tax-rate.pipe'
import {TaxSourceTypeSeverityPipe} from './tax-source-type-severity.pipe'

@Component({
  selector: 'rts-tax-entries-grid',
  templateUrl: 'tax-entries-grid.component.html',
  imports: [
    TableModule,
    Tag,
    Skeleton,
    NullSafePipe,
    PrettifyEnumPipe,
    TaxSourceTypeSeverityPipe,
    TaxRatePipe,
    DatePipe,
    CurrencyPipe,
    AutoStretchDirective,
    EmptyRowComponent
  ],
  providers: [CurrencyPipe, DecimalPipe]
})
export class TaxEntriesGridComponent {
  private readonly taxEntrySearchResultService = inject(TaxEntrySearchResultService)

  private readonly table = viewChild(Table)

  readonly taxEntries = this.taxEntrySearchResultService.selectAll

  readonly loading = computed(() => this.taxEntrySearchResultService.selectLoading())

  readonly $resetScrollOnSearch = effect(() => {
    this.taxEntrySearchResultService.freshLoadCompleted()
    const table = this.table()
    if (table) {
      resetVirtualScrollOnSearch(table)
    }
  })

  onLazyLoad(lazyLoadEvent: TableLazyLoadEvent): void {
    loadNextOnLazyLoad(this.taxEntrySearchResultService, lazyLoadEvent.last)
  }
}
