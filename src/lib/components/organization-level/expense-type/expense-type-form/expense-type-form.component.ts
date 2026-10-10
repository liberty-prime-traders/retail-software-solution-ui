import {NgClass} from '@angular/common'
import {Component, inject, Input, model, OnInit, output, signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {form, FormField} from '@angular/forms/signals'
import {InputText} from 'primeng/inputtext'
import {Checkbox} from 'primeng/checkbox'
import {TreeSelect} from 'primeng/treeselect'
import {TreeNode} from 'primeng/api'
import {ExpenseSourceType} from '../../../../api/cross-tier/expense/expense-source-type.enum'
import {AccountTreesService} from '../../../../api/organization-level/account-trees/account-trees.service'
import {Account} from '../../../../api/organization-level/chart-of-accounts/account.model'
import {ContactType} from '../../../../api/organization-level/contact/contact-type.enum'
import {ExpenseType} from '../../../../api/organization-level/expense-type/expense-type.model'
import {ExpenseTypeService} from '../../../../api/organization-level/expense-type/expense-type.service'
import {EnumToDropdownPipe} from '../../../../utils/pipes/enum-to-dropdown.pipe'
import {RtsTreeNode} from '../../../../utils/types/rts-tree-node'
import {BaseFormComponent} from '../../../reusable/base-form.component'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {LoadingContainerComponent} from '../../../reusable/loading-container/loading-container.component'
import {ExpenseTypeFormDefinition} from './expense-type-form.definition'

@Component({
  selector: 'rts-expense-type-form',
  templateUrl: 'expense-type-form.component.html',
  imports: [
    FormButtonsComponent,
    InputText,
    FormFieldComponent,
    TreeSelect,
    LoadingContainerComponent,
    Checkbox,
    FormsModule,
    FormField,
    NgClass,
    EnumToDropdownPipe
  ]
})
export class ExpenseTypeFormComponent extends BaseFormComponent<ExpenseTypeService> implements OnInit {

  private readonly expenseTypeService = inject(ExpenseTypeService)
  private readonly accountTreesService = inject(AccountTreesService)
  protected override apiService: ExpenseTypeService = this.expenseTypeService

  readonly expenseTypeCreated = output<void>()

  @Input()
  set expenseType(expenseType: ExpenseType | null) {
    if (expenseType) {
      this.originalExpenseType.set(expenseType)
      this.expenseTypeFormValue.set(ExpenseTypeFormDefinition.convertToFormModel(expenseType))
      this.expenseAccount.set(this.findOriginalAccount())
      this.selectedPayeeTypes.set(expenseType.eligiblePayeeTypes)
      this.selectedSourceTypes.set(expenseType.eligibleSourceTypes)
    }
  }

  readonly originalExpenseType = signal<ExpenseType | undefined>(undefined)
  readonly expenseAccount = model<TreeNode<Account> | null>()
  readonly expenseAccountTrees = this.accountTreesService.expenseTypes
  readonly accountTreesLoading = this.accountTreesService.selectLoading

  readonly contactType = ContactType
  readonly expenseSourceType = ExpenseSourceType

  readonly selectedPayeeTypes = model<ContactType[]>([])
  readonly selectedSourceTypes = model<ExpenseSourceType[]>([])

  readonly expenseTypeFormValue = signal<ExpenseTypeFormDefinition.ExpenseTypeFormModel>(
    ExpenseTypeFormDefinition.defaultExpenseTypeFormModel
  )

  readonly expenseTypeForm = form(this.expenseTypeFormValue, ExpenseTypeFormDefinition.expenseTypeFormSchema)
  readonly expenseTypeFormFields = ExpenseTypeFormDefinition.fieldMap

  override ngOnInit() {
    super.ngOnInit()
    this.accountTreesService.fetchRequest({
      callbacks: {onSuccess: () => this.expenseAccount.set(this.findOriginalAccount())}
    })
  }

  onAccountChange() {
    const code = this.expenseAccount()?.key ?? ''
    if (code !== this.expenseTypeFormValue().expenseAccountCode) {
      this.expenseTypeFormValue.update(formValue => ({...formValue, expenseAccountCode: code}))
      this.expenseTypeForm().markAsDirty()
    }
  }

  onPayeeTypeChecked() {
    this.expenseTypeFormValue.update(formValue => ({...formValue, eligiblePayeeTypes: this.selectedPayeeTypes()}))
    this.expenseTypeForm().markAsDirty()
  }

  onSourceTypeChecked() {
    this.expenseTypeFormValue.update(formValue => ({...formValue, eligibleSourceTypes: this.selectedSourceTypes()}))
    this.expenseTypeForm().markAsDirty()
  }

  resetForm() {
    this.expenseTypeFormValue.set(ExpenseTypeFormDefinition.convertToFormModel(this.originalExpenseType()))
    this.expenseAccount.set(this.findOriginalAccount())
    this.selectedPayeeTypes.set(this.originalExpenseType()?.eligiblePayeeTypes ?? [])
    this.selectedSourceTypes.set(this.originalExpenseType()?.eligibleSourceTypes ?? [])
  }

  upsertExpenseType() {
    const formValue = this.expenseTypeFormValue()
    if (formValue.systemDefined) {
      this.expenseTypeService.rename({id: formValue.id, name: formValue.name})
    } else {
      const updatedExpenseType = ExpenseTypeFormDefinition.convertToBackendModel(formValue)
      if (updatedExpenseType.id) {
        this.expenseTypeService.put(updatedExpenseType)
      } else {
        this.expenseTypeService.post(updatedExpenseType, {onSuccess: () => this.expenseTypeCreated.emit()})
      }
    }
  }

  private findOriginalAccount(): TreeNode<Account> | null {
    return RtsTreeNode.findNode(this.originalExpenseType()?.expenseAccountCode, this.expenseAccountTrees())
  }
}
