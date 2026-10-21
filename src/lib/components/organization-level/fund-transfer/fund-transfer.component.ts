import {CurrencyPipe, NgClass} from '@angular/common'
import {Component, computed, effect, inject, model, OnInit, signal, viewChild} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {ButtonDirective} from 'primeng/button'
import {DatePicker} from 'primeng/datepicker'
import {Skeleton} from 'primeng/skeleton'
import {Table, TableModule} from 'primeng/table'
import {Tag} from 'primeng/tag'
import {TableLazyLoadEvent} from 'primeng/types/table'
import {FundMovementSearchParameters} from '../../../api/organization-level/fund-transfer/fund-movement-search-parameters.model'
import {FundMovementSearchResultService} from '../../../api/organization-level/fund-transfer/fund-movement-search-result.service'
import {loadNextOnLazyLoad} from '../../../api/util/paginated-api/paginated-lazy-load.util'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../utils/pipes/prettify-enum.pipe'
import {resetVirtualScrollOnSearch} from '../../../utils/primeng-table.util'
import {AutoStretchDirective} from '../../reusable/auto-stretch.directive'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {FundTransferFormComponent} from './fund-transfer-form/fund-transfer-form.component'
import {FundTransferVoidFormComponent} from './fund-transfer-void-form/fund-transfer-void-form.component'

const DEFAULT_RANGE_DAYS = 30

@Component({
  selector: 'rts-fund-transfer',
  templateUrl: 'fund-transfer.component.html',
  imports: [
    FormsModule,
    TableModule,
    ButtonDirective,
    DatePicker,
    Skeleton,
    Tag,
    CurrencyPipe,
    NgClass,
    NullSafePipe,
    PrettifyEnumPipe,
    AutoStretchDirective,
    EmptyRowComponent,
    FundTransferFormComponent,
    FundTransferVoidFormComponent
  ]
})
export class FundTransferComponent implements OnInit {
  private readonly fundMovementSearchResultService = inject(FundMovementSearchResultService)
  private readonly table = viewChild(Table)

  readonly fundMovements = this.fundMovementSearchResultService.selectAll
  readonly loading = this.fundMovementSearchResultService.selectLoading

  readonly formIsVisible = signal(false)
  readonly dateRange = model<Date[] | null>(FundTransferComponent.defaultDateRange())

  readonly searchParameters = computed<FundMovementSearchParameters | undefined>(() => {
    const [rangeStart, rangeEnd] = this.dateRange() ?? []
    if (!rangeStart) {
      return undefined
    }
    const exclusiveEnd = new Date(rangeEnd ?? rangeStart)
    exclusiveEnd.setDate(exclusiveEnd.getDate() + 1)
    exclusiveEnd.setHours(0, 0, 0, 0)
    return {createdFrom: rangeStart.toISOString(), createdBefore: exclusiveEnd.toISOString()}
  })

  readonly $resetScrollOnSearch = effect(() => {
    this.fundMovementSearchResultService.freshLoadCompleted()
    const table = this.table()
    if (table) {
      resetVirtualScrollOnSearch(table)
    }
  })

  ngOnInit() {
    this.search()
  }

  search() {
    const parameters = this.searchParameters()
    if (parameters) {
      this.fundMovementSearchResultService.refetch(parameters)
    }
  }

  onDateRangeChange(dateRange: Date[] | null) {
    this.dateRange.set(dateRange)
    if (dateRange?.[0] && dateRange[1]) {
      this.search()
    }
  }

  refreshAfterWrite() {
    this.formIsVisible.set(false)
    const parameters = this.searchParameters()
    if (parameters) {
      this.fundMovementSearchResultService.forceRefetch(parameters)
    }
  }

  onLazyLoad(lazyLoadEvent: TableLazyLoadEvent) {
    loadNextOnLazyLoad(this.fundMovementSearchResultService, lazyLoadEvent.last)
  }

  private static defaultDateRange(): Date[] {
    const rangeEnd = new Date()
    const rangeStart = new Date()
    rangeStart.setDate(rangeStart.getDate() - DEFAULT_RANGE_DAYS)
    return [rangeStart, rangeEnd]
  }
}
