import {Component, inject, input, output, signal} from '@angular/core'
import {form, FormField} from '@angular/forms/signals'
import {InputText} from 'primeng/inputtext'
import {Loan} from '../../../../api/organization-level/loan/loan.model'
import {LoanService} from '../../../../api/organization-level/loan/loan.service'
import {BaseFormComponent} from '../../../reusable/base-form.component'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldLayout} from '../../../reusable/form-field/form-field-layout'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'

@Component({
  selector: 'rts-loan-void-form',
  templateUrl: 'loan-void-form.component.html',
  imports: [FormButtonsComponent, FormFieldComponent, FormField, InputText]
})
export class LoanVoidFormComponent extends BaseFormComponent<LoanService> {
  readonly loan = input.required<Loan>()

  readonly voided = output()
  readonly cancelled = output()

  protected readonly apiService = inject(LoanService)

  readonly FormFieldDirection = FormFieldLayout

  private readonly voidFormValue = signal({reason: ''})
  readonly voidForm = form(this.voidFormValue)

  confirmVoid() {
    this.apiService.voidLoan(
      {loanId: String(this.loan().id), reason: this.voidFormValue().reason || undefined},
      {onSuccess: () => this.voided.emit()}
    )
  }
}
