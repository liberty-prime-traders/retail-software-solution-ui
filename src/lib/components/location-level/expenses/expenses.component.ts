import {Component, inject, OnInit, signal} from '@angular/core'
import {ButtonDirective} from 'primeng/button'
import {ExpenseService} from '../../../api/cross-tier/expense/expense.service'
import {ExpenseBatchFormComponent} from './expense-batch-form/expense-batch-form.component'
import {ExpenseGridComponent} from './expense-grid/expense-grid.component'

@Component({
  selector: 'rts-expenses',
  templateUrl: 'expenses.component.html',
  imports: [
    ButtonDirective,
    ExpenseGridComponent,
    ExpenseBatchFormComponent
  ]
})
export class ExpensesComponent implements OnInit {
  private readonly expenseService = inject(ExpenseService)

  readonly formIsVisible = signal(false)

  ngOnInit() {
    this.expenseService.fetchRecent()
  }
}
