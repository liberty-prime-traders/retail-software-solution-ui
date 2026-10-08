import {Component, inject, input, output, signal} from '@angular/core'
import {form, FormField, required} from '@angular/forms/signals'
import {InputText} from 'primeng/inputtext'
import {Expense, ExpenseVoidRequest} from '../../../../api/cross-tier/expense/expense.model'
import {ExpenseService} from '../../../../api/cross-tier/expense/expense.service'
import {BaseFormComponent} from '../../../reusable/base-form.component'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldLayout} from '../../../reusable/form-field/form-field-layout'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'

@Component({
  selector: 'rts-expense-void-form',
  templateUrl: 'expense-void-form.component.html',
  imports: [FormButtonsComponent, FormFieldComponent, FormField, InputText]
})
export class ExpenseVoidFormComponent extends BaseFormComponent<ExpenseService> {
  readonly expense = input.required<Expense>()

  readonly voided = output()
  readonly cancelled = output()

  protected readonly apiService = inject(ExpenseService)

  readonly FormFieldDirection = FormFieldLayout

  private readonly voidFormValue = signal({reason: ''})

  readonly voidForm = form(this.voidFormValue, s => {
    required(s.reason)
  })

  confirmVoid() {
    const voidRequest: ExpenseVoidRequest = {
      expenseReference: this.expense().reference,
      reason: this.voidFormValue().reason
    }
    this.apiService.voidExpense(voidRequest, {onSuccess: () => this.voided.emit()})
  }
}
