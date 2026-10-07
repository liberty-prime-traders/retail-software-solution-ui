import {CurrencyPipe, NgClass} from '@angular/common'
import {Component, input} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {TableModule} from 'primeng/table'
import {ExpensePayment} from '../../../../api/cross-tier/expense/expense.model'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {EmptyRowComponent} from '../../../reusable/empty-row/empty-row.component'

@Component({
  selector: 'rts-expense-payment-subgrid',
  templateUrl: 'expense-payment-subgrid.component.html',
  imports: [
    TableModule,
    FormsModule,
    CurrencyPipe,
    NgClass,
    EmptyRowComponent,
    NullSafePipe
  ]
})
export class ExpensePaymentSubgridComponent {
  readonly payments = input.required<ExpensePayment[]>()
}
