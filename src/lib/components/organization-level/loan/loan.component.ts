import {CurrencyPipe, NgClass} from '@angular/common'
import {Component, computed, effect, inject, model, OnInit, signal, viewChild} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {ButtonDirective} from 'primeng/button'
import {DatePicker} from 'primeng/datepicker'
import {Skeleton} from 'primeng/skeleton'
import {Table, TableModule} from 'primeng/table'
import {Tag} from 'primeng/tag'
import {TableLazyLoadEvent} from 'primeng/types/table'
import {LoanSearchParameters} from '../../../api/organization-level/loan/loan-search-parameters.model'
import {LoanSearchResultService} from '../../../api/organization-level/loan/loan-search-result.service'
import {LoanStatus} from '../../../api/organization-level/loan/loan-status.enum'
import {loadNextOnLazyLoad} from '../../../api/util/paginated-api/paginated-lazy-load.util'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../utils/pipes/prettify-enum.pipe'
import {resetVirtualScrollOnSearch} from '../../../utils/primeng-table.util'
import {AutoStretchDirective} from '../../reusable/auto-stretch.directive'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {LoanFormComponent} from './loan-form/loan-form.component'
import {LoanRepaymentFormComponent} from './loan-repayment-form/loan-repayment-form.component'
import {LoanRepaymentVoidFormComponent} from './loan-repayment-void-form/loan-repayment-void-form.component'
import {LoanVoidFormComponent} from './loan-void-form/loan-void-form.component'

const DEFAULT_RANGE_DAYS = 30

@Component({
  selector: 'rts-loan',
  templateUrl: 'loan.component.html',
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
    LoanFormComponent,
    LoanRepaymentFormComponent,
    LoanRepaymentVoidFormComponent,
    LoanVoidFormComponent
  ]
})
export class LoanComponent implements OnInit {
  private readonly loanSearchResultService = inject(LoanSearchResultService)
  private readonly table = viewChild(Table)

  readonly LoanStatus = LoanStatus

  readonly loans = this.loanSearchResultService.selectAll
  readonly loading = this.loanSearchResultService.selectLoading

  readonly formIsVisible = signal(false)
  readonly voidingLoanIsVisible = signal(false)
  readonly repaymentBeingVoided = signal<string | null>(null)
  readonly dateRange = model<Date[] | null>(LoanComponent.defaultDateRange())

  readonly searchParameters = computed<LoanSearchParameters | undefined>(() => {
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
    this.loanSearchResultService.freshLoadCompleted()
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
      this.loanSearchResultService.refetch(parameters)
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
    this.voidingLoanIsVisible.set(false)
    this.repaymentBeingVoided.set(null)
    const parameters = this.searchParameters()
    if (parameters) {
      this.loanSearchResultService.forceRefetch(parameters)
    }
  }

  onLazyLoad(lazyLoadEvent: TableLazyLoadEvent) {
    loadNextOnLazyLoad(this.loanSearchResultService, lazyLoadEvent.last)
  }

  private static defaultDateRange(): Date[] {
    const rangeEnd = new Date()
    const rangeStart = new Date()
    rangeStart.setDate(rangeStart.getDate() - DEFAULT_RANGE_DAYS)
    return [rangeStart, rangeEnd]
  }
}
