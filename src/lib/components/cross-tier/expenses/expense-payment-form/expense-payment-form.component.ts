import {Component, computed, inject, input, OnInit, output, signal} from '@angular/core'
import {applyEach, form, FormField} from '@angular/forms/signals'
import {ButtonDirective} from 'primeng/button'
import {DatePicker} from 'primeng/datepicker'
import {InputNumber} from 'primeng/inputnumber'
import {InputText} from 'primeng/inputtext'
import {Select} from 'primeng/select'
import {Expense} from '../../../../api/cross-tier/expense/expense.model'
import {EXPENSE_ACTIONS} from '../../../../api/cross-tier/expense/expense-actions'
import {PaymentOptionService} from '../../../../api/organization-level/payment-option/payment-option.service'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {LoadingContainerComponent} from '../../../reusable/loading-container/loading-container.component'
import {ExpensePaymentFormDefinition} from './expense-payment-form.definition'

@Component({
  selector: 'rts-expense-payment-form',
  templateUrl: 'expense-payment-form.component.html',
  imports: [
    FormField,
    ButtonDirective,
    DatePicker,
    InputNumber,
    InputText,
    Select,
    FormButtonsComponent,
    LoadingContainerComponent
  ]
})
export class ExpensePaymentFormComponent implements OnInit {
  readonly expense = input.required<Expense>()

  readonly paymentsSaved = output()
  readonly cancelled = output()

  private readonly expenseActions = inject(EXPENSE_ACTIONS)
  private readonly paymentOptionService = inject(PaymentOptionService)

  readonly isLoading = this.expenseActions.selectLoading
  readonly processingStatus = this.expenseActions.selectProcessingStatus
  readonly failureMessages = this.expenseActions.selectFailureMessages
  readonly paymentOptions = this.paymentOptionService.selectAll

  private readonly rows = signal<ExpensePaymentFormDefinition.PaymentRowModel[]>([])
  readonly paymentsForm = form(this.rows, (path) => applyEach(path, ExpensePaymentFormDefinition.rowSchema))

  readonly paymentCount = computed(() => this.rows().length)
  readonly totalPayment = computed(() => this.rows().reduce((sum, row) => sum + (row.amount ?? 0), 0))

  ngOnInit() {
    this.expenseActions.resetProcessingStatus()
    this.paymentOptionService.fetch()
    this.addRow(this.expense().balanceRemaining)
  }

  addRow(amount: number | null = null) {
    this.rows.update(current => [...current, ExpensePaymentFormDefinition.createDefaultRow(amount)])
  }

  removeRow(index: number) {
    this.rows.update(current => current.filter((_, i) => i !== index))
  }

  cancel() {
    this.cancelled.emit()
  }

  save() {
    const dtos = ExpensePaymentFormDefinition.convertToBackendModel(this.rows(), this.expense().reference)
    this.expenseActions.createPayments(dtos, {onSuccess: () => this.paymentsSaved.emit()})
  }
}
