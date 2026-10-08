import {CurrencyPipe, NgClass} from '@angular/common'
import {Component, inject} from '@angular/core'
import {TableModule} from 'primeng/table'
import {Tag} from 'primeng/tag'
import {ExpenseService} from '../../../../api/cross-tier/expense/expense.service'
import {PaymentStatusSeverityPipe} from '../../../../api/cross-tier/payment-status-severity.pipe'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../../utils/pipes/prettify-enum.pipe'
import {AutoStretchDirective} from '../../../reusable/auto-stretch.directive'
import {EmptyRowComponent} from '../../../reusable/empty-row/empty-row.component'
import {GridFilterComponent} from '../../../reusable/grid-filter/grid-filter.component'

@Component({
  selector: 'rts-expense-grid',
  templateUrl: 'expense-grid.component.html',
  imports: [
    TableModule,
    CurrencyPipe,
    NgClass,
    Tag,
    EmptyRowComponent,
    GridFilterComponent,
    AutoStretchDirective,
    NullSafePipe,
    PrettifyEnumPipe,
    PaymentStatusSeverityPipe
  ]
})
export class ExpenseGridComponent {
  private readonly expenseService = inject(ExpenseService)

  readonly expenses = this.expenseService.selectAll
  readonly loading = this.expenseService.selectLoading
  readonly filterFields = ['payeeDisplayName', 'expenseTypeName', 'description', 'sourceReference', 'batchReference']
}
