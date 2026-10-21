import {CurrencyPipe, NgClass} from '@angular/common'
import {Component, input, output, signal} from '@angular/core'
import {ButtonDirective} from 'primeng/button'
import {Panel} from 'primeng/panel'
import {TableModule} from 'primeng/table'
import {LoanStatus} from '../../../../api/organization-level/loan/loan-status.enum'
import {Loan} from '../../../../api/organization-level/loan/loan.model'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {EmptyRowComponent} from '../../../reusable/empty-row/empty-row.component'
import {LoanRepaymentFormComponent} from '../loan-repayment-form/loan-repayment-form.component'
import {LoanRepaymentVoidFormComponent} from '../loan-repayment-void-form/loan-repayment-void-form.component'
import {LoanVoidFormComponent} from '../loan-void-form/loan-void-form.component'

@Component({
  selector: 'rts-loan-expanded-row',
  templateUrl: 'loan-expanded-row.component.html',
  imports: [
    ButtonDirective,
    CurrencyPipe,
    NgClass,
    NullSafePipe,
    LoanRepaymentFormComponent,
    LoanRepaymentVoidFormComponent,
    LoanVoidFormComponent,
    Panel,
    TableModule,
    EmptyRowComponent
  ]
})
export class LoanExpandedRowComponent {
  readonly loan = input.required<Loan>()

  readonly changed = output()

  readonly LoanStatus = LoanStatus

  readonly voidingLoanIsVisible = signal(false)
}
