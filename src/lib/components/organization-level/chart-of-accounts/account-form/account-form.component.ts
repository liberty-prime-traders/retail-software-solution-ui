import {NgClass} from '@angular/common'
import {Component, computed, inject, Input, output, signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {form, FormField} from '@angular/forms/signals'
import {TreeNode} from 'primeng/api'
import {Button} from 'primeng/button'
import {Checkbox} from 'primeng/checkbox'
import {InputText} from 'primeng/inputtext'
import {Select} from 'primeng/select'
import {TreeSelect} from 'primeng/treeselect'
import {AccountType} from '../../../../api/organization-level/chart-of-accounts/account-type.enum'
import {Account, toAccountTreeNodes} from '../../../../api/organization-level/chart-of-accounts/account.model'
import {AccountService} from '../../../../api/organization-level/chart-of-accounts/account.service'
import {EnumToDropdownPipe} from '../../../../utils/pipes/enum-to-dropdown.pipe'
import {BaseFormComponent} from '../../../reusable/base-form.component'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {AccountFormDefinition} from './account-form.definition'

@Component({
  selector: 'rts-account-form',
  templateUrl: 'account-form.component.html',
  imports: [
    FormButtonsComponent,
    InputText,
    FormFieldComponent,
    FormField,
    NgClass,
    Button,
    Checkbox,
    FormsModule,
    TreeSelect,
    Select,
    EnumToDropdownPipe
  ]
})
export class AccountFormComponent extends BaseFormComponent<AccountService> {

  private readonly accountService = inject(AccountService)
  protected override readonly apiService = this.accountService

  readonly accountCreated = output<void>()

  @Input()
  set account(account: Account | null) {
    if (account) {
      this.originalAccount.set(account)
      this.accountFormValue.set(AccountFormDefinition.convertToFormModel(account))
    }
  }

  readonly originalAccount = signal<Account | undefined>(undefined)
  readonly isEditMode = computed(() => !!this.originalAccount())

  readonly extensibleAccounts = computed(() =>
    toAccountTreeNodes(this.accountService.selectAll().filter(a => a.accountIsExtensible))
  )

  readonly accountFormValue = signal<AccountFormDefinition.AccountFormModel>(
    AccountFormDefinition.defaultAccountFormModel
  )

  readonly selectedParentAccount  = signal<TreeNode<Account> | null>(null)

  readonly AccountType = AccountType

  readonly accountForm = form(this.accountFormValue, AccountFormDefinition.accountFormSchema)
  readonly accountFormFields = AccountFormDefinition.fieldMap

  onParentChange() {
    const parent =  this.selectedParentAccount()
    const currentFormValue = this.accountFormValue()
    if (parent?.key !== currentFormValue.parentAccountCode) {
      this.accountFormValue.update(v => ({
        ...v,
        parentAccountCode: parent?.key ?? ''
      }))
    }
  }

  onIsRootChange() {
    if (this.accountFormValue().isRoot) {
      this.selectedParentAccount.set(null)
      this.onParentChange()
    }
  }

  resetForm() {
    this.accountFormValue.set(AccountFormDefinition.convertToFormModel(this.originalAccount()))
  }

  saveAccount() {
    const formValue = this.accountFormValue()
    const onSuccess = () => this.accountCreated.emit()
    if (this.isEditMode()) {
      this.accountService.put({id: formValue.id, name: formValue.name})

    } else if (formValue.isRoot) {
      this.accountService.createRoot(
        {name: formValue.name, accountType: formValue.accountType ?? undefined},
        {onSuccess}
      )

    } else {
      this.accountService.createChild(
        {name: formValue.name, parentAccountCode: formValue.parentAccountCode},
        {onSuccess}
      )
    }
  }

  toggleActive() {
    const account = this.originalAccount()
    if (!account) return
    if (account.accountIsActive) {
      this.accountService.deactivate(account.id)
    } else {
      this.accountService.activate(account.id)
    }
  }
}
