import {Component, computed, inject, input, signal} from '@angular/core'
import {form, FormField, required} from '@angular/forms/signals'
import {ButtonDirective} from 'primeng/button'
import {InputText} from 'primeng/inputtext'
import {ExpensePayment, ExpensePaymentVoidRequest} from '../../../../api/cross-tier/expense/expense.model'
import {ContextualExpenseService} from '../../../../api/cross-tier/contextual-expense/contextual-expense.service'
import {BaseFormComponent} from '../../../reusable/base-form.component'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldLayout} from '../../../reusable/form-field/form-field-layout'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'

@Component({
  selector: 'rts-expense-payment-expanded-row',
  templateUrl: 'expense-payment-expanded-row.component.html',
  imports: [ButtonDirective, FormButtonsComponent, FormFieldComponent, FormField, InputText]
})
export class ExpensePaymentExpandedRowComponent extends BaseFormComponent<ContextualExpenseService> {
  readonly payment = input.required<ExpensePayment>()

  protected readonly apiService = inject(ContextualExpenseService)

  readonly FormFieldDirection = FormFieldLayout
  readonly isVoided = computed(() => this.payment().voided)
  readonly voidIsActive = signal(false)

  private readonly voidFormValue = signal({reason: ''})

  readonly voidForm = form(this.voidFormValue, s => {
    required(s.reason)
  })

  confirmVoid() {
    const voidRequest: ExpensePaymentVoidRequest = {
      paymentReference: this.payment().reference,
      reason: this.voidFormValue().reason
    }
    this.apiService.voidPayment(voidRequest, {
      onSuccess: () => this.voidIsActive.set(false)
    })
  }
}
