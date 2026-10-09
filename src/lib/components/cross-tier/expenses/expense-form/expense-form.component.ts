import {NgTemplateOutlet} from '@angular/common'
import {Component, computed, inject, input, OnInit, output, signal} from '@angular/core'
import {applyEach, form, FormField} from '@angular/forms/signals'
import {Badge} from 'primeng/badge'
import {ButtonDirective} from 'primeng/button'
import {Card} from 'primeng/card'
import {Checkbox} from 'primeng/checkbox'
import {DatePicker} from 'primeng/datepicker'
import {InputNumber} from 'primeng/inputnumber'
import {InputText} from 'primeng/inputtext'
import {Select} from 'primeng/select'
import {ContextualExpenseService} from '../../../../api/cross-tier/contextual-expense/contextual-expense.service'
import {ContactService} from '../../../../api/organization-level/contact/contact.service'
import {ExpenseTypeService} from '../../../../api/organization-level/expense-type/expense-type.service'
import {PaymentOptionService} from '../../../../api/organization-level/payment-option/payment-option.service'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {LoadingContainerComponent} from '../../../reusable/loading-container/loading-container.component'
import {ExpenseFormDefinition} from './expense-form.definition'

@Component({
  selector: 'rts-expense-form',
  templateUrl: 'expense-form.component.html',
  imports: [
    FormField,
    ButtonDirective,
    Checkbox,
    DatePicker,
    InputNumber,
    InputText,
    Select,
    FormButtonsComponent,
    LoadingContainerComponent,
    Card,
    NgTemplateOutlet,
    Badge
  ]
})
export class ExpenseFormComponent implements OnInit {
  readonly purchaseReference = input.required<string>()
  readonly defaultPayeeContactId = input<string | null>(null)

  readonly expensesSaved = output()
  readonly cancelled = output()

  private readonly contextualExpenseService = inject(ContextualExpenseService)
  private readonly contactService = inject(ContactService)
  private readonly expenseTypeService = inject(ExpenseTypeService)
  private readonly paymentOptionService = inject(PaymentOptionService)

  readonly isLoading = this.contextualExpenseService.selectLoading
  readonly processingStatus = this.contextualExpenseService.selectProcessingStatus
  readonly failureMessages = this.contextualExpenseService.selectFailureMessages
  readonly contacts = this.contactService.selectAll
  readonly expenseTypes = this.expenseTypeService.forPurchase
  readonly paymentOptions = this.paymentOptionService.selectAll

  private readonly rows = signal<ExpenseFormDefinition.ExpenseRowModel[]>([])
  readonly expensesForm = form(this.rows, (path) => applyEach(path, ExpenseFormDefinition.rowSchema))

  readonly expenseCount = computed(() => this.rows().length)
  readonly totalAmount = computed(() => this.rows().reduce((sum, row) => sum + (row.amount ?? 0), 0))

  ngOnInit() {
    this.contextualExpenseService.resetProcessingStatus()
    this.contactService.fetch()
    this.expenseTypeService.fetch()
    this.paymentOptionService.fetch()
    this.addRow()
  }

  addRow() {
    this.rows.update(current => [...current, ExpenseFormDefinition.createDefaultRow(this.defaultPayeeContactId())])
  }

  removeRow(index: number) {
    this.rows.update(current => current.filter((_, i) => i !== index))
  }

  cancel() {
    this.cancelled.emit()
  }

  save() {
    const dto = ExpenseFormDefinition.convertToBackendModel(this.rows(), this.purchaseReference())
    this.contextualExpenseService.createForPurchase(dto, {onSuccess: () => this.expensesSaved.emit()})
  }
}
