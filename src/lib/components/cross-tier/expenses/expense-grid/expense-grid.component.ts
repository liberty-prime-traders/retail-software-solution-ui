import {CurrencyPipe, NgClass} from '@angular/common'
import {Component, effect, inject, input, signal, untracked} from '@angular/core'
import {ButtonDirective} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {Tag} from 'primeng/tag'
import {ExpenseSourceType} from '../../../../api/cross-tier/expense/expense-source-type.enum'
import {ExpenseService} from '../../../../api/cross-tier/expense/expense.service'
import {PaymentStatusSeverityPipe} from '../../../../api/cross-tier/payment-status-severity.pipe'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../../utils/pipes/prettify-enum.pipe'
import {EmptyRowComponent} from '../../../reusable/empty-row/empty-row.component'
import {ExpenseFormComponent} from '../expense-form/expense-form.component'
import {ExpensePaymentSubgridComponent} from '../expense-payment-subgrid/expense-payment-subgrid.component'

@Component({
  selector: 'rts-expense-grid',
  templateUrl: 'expense-grid.component.html',
  imports: [
    TableModule,
    ButtonDirective,
    CurrencyPipe,
    NgClass,
    EmptyRowComponent,
    ExpensePaymentSubgridComponent,
    ExpenseFormComponent,
    NullSafePipe,
    PrettifyEnumPipe,
    PaymentStatusSeverityPipe,
    Tag
  ]
})
export class ExpenseGridComponent {
  readonly sourceReference = input.required<string>()
  readonly sourceType = input.required<ExpenseSourceType>()
  readonly defaultPayeeContactId = input<string | null>(null)
  readonly canAddExpense = input<boolean>(false)

  private readonly expenseService = inject(ExpenseService)

  readonly expenses = this.expenseService.selectForGroup(this.sourceReference)
  readonly showAddForm = signal(false)
  readonly expandedRows = signal<Record<string, boolean>>({})

  private readonly refetchExpenses = effect(() => {
    const sourceReference = this.sourceReference()
    const sourceType = this.sourceType()
    untracked(() => this.expenseService.fetchForSource({sourceReference, sourceType}))
  })

  private readonly expandAllRows = effect(() => {
    const keys = Object.fromEntries(this.expenses().map(expense => [expense.reference, true]))
    untracked(() => this.expandedRows.set(keys))
  })
}
