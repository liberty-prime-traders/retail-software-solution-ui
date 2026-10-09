import {CurrencyPipe, NgClass} from '@angular/common'
import {Component, computed, input, signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {ButtonDirective} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {Expense} from '../../../../api/cross-tier/expense/expense.model'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {EmptyRowComponent} from '../../../reusable/empty-row/empty-row.component'
import {
  ExpensePaymentExpandedRowComponent
} from '../expense-payment-expanded-row/expense-payment-expanded-row.component'
import {ExpensePaymentFormComponent} from '../expense-payment-form/expense-payment-form.component'
import {ExpenseVoidFormComponent} from '../expense-void-form/expense-void-form.component'

@Component({
  selector: 'rts-expense-payment-subgrid',
  templateUrl: 'expense-payment-subgrid.component.html',
  imports: [
    TableModule,
    FormsModule,
    CurrencyPipe,
    NgClass,
    EmptyRowComponent,
    NullSafePipe,
    ButtonDirective,
    ExpensePaymentFormComponent,
    ExpensePaymentExpandedRowComponent,
    ExpenseVoidFormComponent
  ]
})
export class ExpensePaymentSubgridComponent {
  readonly expense = input.required<Expense>()

  readonly showPaymentForm = signal(false)
  readonly showVoidForm = signal(false)
  readonly canVoidExpense = computed(() => !this.expense().voided)
  readonly hasActivePayments = computed(() => this.expense().payments.some(payment => !payment.voided))
  readonly canAddPayment = computed(() => !this.expense().voided && this.expense().balanceRemaining > 0)
}
