import {NgTemplateOutlet} from '@angular/common'
import {Component, computed, effect, inject, OnInit, output, signal, untracked} from '@angular/core'
import {form, FormField} from '@angular/forms/signals'
import {Badge} from 'primeng/badge'
import {ButtonDirective} from 'primeng/button'
import {Card} from 'primeng/card'
import {Checkbox} from 'primeng/checkbox'
import {DatePicker} from 'primeng/datepicker'
import {Divider} from 'primeng/divider'
import {InputNumber} from 'primeng/inputnumber'
import {InputText} from 'primeng/inputtext'
import {Select} from 'primeng/select'
import {SelectButton} from 'primeng/selectbutton'
import {ExpenseService} from '../../../../api/cross-tier/expense/expense.service'
import {ExpenseSourceType} from '../../../../api/cross-tier/expense/expense-source-type.enum'
import {ContactType} from '../../../../api/organization-level/contact/contact-type.enum'
import {ContactService} from '../../../../api/organization-level/contact/contact.service'
import {ExpenseTypeService} from '../../../../api/organization-level/expense-type/expense-type.service'
import {PaymentOptionService} from '../../../../api/organization-level/payment-option/payment-option.service'
import {AutoStretchDirective} from '../../../reusable/auto-stretch.directive'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {LoadingContainerComponent} from '../../../reusable/loading-container/loading-container.component'
import {ExpenseBatchFormDefinition} from './expense-batch-form.definition'

@Component({
  selector: 'rts-expense-batch-form',
  templateUrl: 'expense-batch-form.component.html',
  imports: [
    FormField,
    ButtonDirective,
    Checkbox,
    DatePicker,
    InputNumber,
    InputText,
    Select,
    SelectButton,
    FormButtonsComponent,
    LoadingContainerComponent,
    Card,
    NgTemplateOutlet,
    Badge,
    Divider,
    AutoStretchDirective
  ]
})
export class ExpenseBatchFormComponent implements OnInit {
  readonly expensesSaved = output()
  readonly cancelled = output()

  private readonly expenseService = inject(ExpenseService)
  private readonly contactService = inject(ContactService)
  private readonly expenseTypeService = inject(ExpenseTypeService)
  private readonly paymentOptionService = inject(PaymentOptionService)

  readonly isLoading = this.expenseService.selectLoading
  readonly processingStatus = this.expenseService.selectProcessingStatus
  readonly failureMessages = this.expenseService.selectFailureMessages
  readonly expenseTypes = this.expenseTypeService.forAdhoc
  readonly paymentOptions = this.paymentOptionService.selectAll
  readonly batchTypeOptions = ExpenseBatchFormDefinition.batchTypeOptions

  private readonly model = signal(ExpenseBatchFormDefinition.createDefaultModel())
  readonly batchForm = form(this.model, ExpenseBatchFormDefinition.batchSchema)

  readonly isAdhoc = computed(() => ExpenseBatchFormDefinition.isAdhoc(this.model()))
  readonly isWages = computed(() => ExpenseBatchFormDefinition.isWages(this.model()))
  readonly isGrouped = computed(() => ExpenseBatchFormDefinition.isGrouped(this.model()))
  readonly rowCount = computed(() => this.model().rows.length)
  readonly payees = computed(() => {
    const contacts = this.contactService.selectAll()
    return this.isWages() ? contacts.filter(contact => contact.contactTypes.includes(ContactType.EMPLOYEE)) : contacts
  })

  private readonly batchType = computed(() => this.model().batchType)

  private readonly resetRowsOnBatchTypeChange = effect(() => {
    const batchType = this.batchType()
    untracked(() => this.model.update(model => ({
      ...model,
      rows: [ExpenseBatchFormDefinition.createDefaultRow(batchType)]
    })))
  })

  private readonly keepSingleRowWhenUngrouped = effect(() => {
    if (!this.isGrouped()) {
      untracked(() => this.model.update(model =>
        model.rows.length > 1 ? {...model, rows: model.rows.slice(0, 1)} : model
      ))
    }
  })

  ngOnInit() {
    this.expenseService.resetProcessingStatus()
    this.contactService.fetch()
    this.expenseTypeService.fetch()
    this.paymentOptionService.fetch()
  }

  addRow() {
    this.model.update(model => ({
      ...model,
      rows: [...model.rows, ExpenseBatchFormDefinition.createDefaultRow(model.batchType)]
    }))
  }

  removeRow(index: number) {
    this.model.update(model => ({...model, rows: model.rows.filter((_, i) => i !== index)}))
  }

  cancel() {
    this.cancelled.emit()
  }

  save() {
    const callbacks = {onSuccess: () => this.expensesSaved.emit()}
    const model = this.model()
    if (model.batchType === ExpenseSourceType.WAGES) {
      this.expenseService.createWages(ExpenseBatchFormDefinition.convertToWageRequest(model), callbacks)
    } else {
      this.expenseService.createStandalone(ExpenseBatchFormDefinition.convertToStandaloneRequest(model), callbacks)
    }
  }
}
