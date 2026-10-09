import {CurrencyPipe} from '@angular/common'
import {Component, computed, inject} from '@angular/core'
import {Panel} from 'primeng/panel'
import {Table} from 'primeng/table'
import {ExpenseSearchSummaryService} from '../../../api/cross-tier/expense/expense-search-summary.service'
import {PrettifyEnumPipe} from '../../../utils/pipes/prettify-enum.pipe'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'

@Component({
  selector: 'rts-expenses-summary',
  imports: [
    Table,
    Panel,
    CurrencyPipe,
    PrettifyEnumPipe,
    EmptyRowComponent
  ],
  templateUrl: 'expenses-summary.component.html'
})
export class ExpensesSummaryComponent {
  private readonly expenseSearchSummaryService = inject(ExpenseSearchSummaryService)

  readonly expenseSearchSummary = this.expenseSearchSummaryService.expenseSearchSummary

  readonly expenseCount = computed(() => this.expenseSearchSummary()?.expenseCount ?? 0)
  readonly amountTotal = computed(() => this.expenseSearchSummary()?.amountTotal ?? 0)
  readonly paidTotal = computed(() => this.expenseSearchSummary()?.paidTotal ?? 0)
  readonly outstandingTotal = computed(() => this.expenseSearchSummary()?.outstandingTotal ?? 0)
  readonly voidedCount = computed(() => this.expenseSearchSummary()?.voidedCount ?? 0)
  readonly voidedAmountTotal = computed(() => this.expenseSearchSummary()?.voidedAmountTotal ?? 0)

  readonly byStatus = computed(() => this.expenseSearchSummary()?.byStatus ?? [])

  readonly byExpenseType = computed(() => this.expenseSearchSummary()?.byExpenseType ?? [])
}
