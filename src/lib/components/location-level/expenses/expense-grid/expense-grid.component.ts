import {CurrencyPipe, NgClass} from '@angular/common'
import {Component, effect, inject, viewChild} from '@angular/core'
import {SortMeta} from 'primeng/api'
import {ButtonDirective} from 'primeng/button'
import {Skeleton} from 'primeng/skeleton'
import {Table, TableModule} from 'primeng/table'
import {TableLazyLoadEvent} from 'primeng/types/table'
import {Tag} from 'primeng/tag'
import {EXPENSE_ACTIONS} from '../../../../api/cross-tier/expense/expense-actions'
import {ExpenseSearchResultService} from '../../../../api/cross-tier/expense/expense-search-result.service'
import {ExpenseService} from '../../../../api/cross-tier/expense/expense.service'
import {PaymentStatusSeverityPipe} from '../../../../api/cross-tier/payment-status-severity.pipe'
import {loadNextOnLazyLoad} from '../../../../api/util/paginated-api/paginated-lazy-load.util'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../../utils/pipes/prettify-enum.pipe'
import {resetVirtualScrollOnSearch} from '../../../../utils/primeng-table.util'
import {ExpensePaymentSubgridComponent} from '../../../cross-tier/expenses/expense-payment-subgrid/expense-payment-subgrid.component'
import {AutoStretchDirective} from '../../../reusable/auto-stretch.directive'
import {EmptyRowComponent} from '../../../reusable/empty-row/empty-row.component'

@Component({
  selector: 'rts-expense-grid',
  templateUrl: 'expense-grid.component.html',
  providers: [{provide: EXPENSE_ACTIONS, useExisting: ExpenseService}],
  imports: [
    TableModule,
    CurrencyPipe,
    NgClass,
    Tag,
    EmptyRowComponent,
    Skeleton,
    AutoStretchDirective,
    NullSafePipe,
    PrettifyEnumPipe,
    PaymentStatusSeverityPipe,
    ButtonDirective,
    ExpensePaymentSubgridComponent
  ]
})
export class ExpenseGridComponent {
  private readonly expenseSearchResultService = inject(ExpenseSearchResultService)

  private readonly table = viewChild(Table)

  readonly expenses = this.expenseSearchResultService.selectAll
  readonly loading = this.expenseSearchResultService.selectLoading

  readonly multiSortMeta : SortMeta[] = [{field: 'expenseDate', order: -1}, {field: 'reference', order: 1}]

  readonly $resetScrollOnSearch = effect(() => {
    this.expenseSearchResultService.freshLoadCompleted()
    const table = this.table()
    if (table) {
      resetVirtualScrollOnSearch(table)
    }
  })

  onLazyLoad(lazyLoadEvent: TableLazyLoadEvent): void {
    loadNextOnLazyLoad(this.expenseSearchResultService, lazyLoadEvent.last)
  }
}
