import {Component, inject, OnInit, output, signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {form, FormField} from '@angular/forms/signals'
import {TreeNode} from 'primeng/api'
import {DatePicker} from 'primeng/datepicker'
import {InputNumber} from 'primeng/inputnumber'
import {InputText} from 'primeng/inputtext'
import {Select} from 'primeng/select'
import {TreeSelect} from 'primeng/treeselect'
import {AccountTreesService} from '../../../../api/organization-level/account-trees/account-trees.service'
import {Account} from '../../../../api/organization-level/chart-of-accounts/account.model'
import {ContactService} from '../../../../api/organization-level/contact/contact.service'
import {LoanService} from '../../../../api/organization-level/loan/loan.service'
import {BaseFormComponent} from '../../../reusable/base-form.component'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {LoadingContainerComponent} from '../../../reusable/loading-container/loading-container.component'
import {LoanFormDefinition} from './loan-form.definition'

@Component({
  selector: 'rts-loan-form',
  templateUrl: 'loan-form.component.html',
  imports: [
    FormsModule,
    FormField,
    FormButtonsComponent,
    FormFieldComponent,
    LoadingContainerComponent,
    DatePicker,
    InputNumber,
    InputText,
    Select,
    TreeSelect
  ]
})
export class LoanFormComponent extends BaseFormComponent<LoanService> implements OnInit {
  private readonly loanService = inject(LoanService)
  private readonly accountTreesService = inject(AccountTreesService)
  private readonly contactService = inject(ContactService)
  protected override readonly apiService = this.loanService

  readonly loanCreated = output<void>()

  readonly formValue = signal<LoanFormDefinition.LoanFormModel>(LoanFormDefinition.createDefaultFormModel())
  readonly loanForm = form(this.formValue, LoanFormDefinition.formSchema)
  readonly fieldMap = LoanFormDefinition.fieldMap

  readonly lenders = this.contactService.lenders
  readonly loanTrees = this.accountTreesService.loans
  readonly accountTreesLoading = this.accountTreesService.selectLoading

  readonly assetAccount = signal<TreeNode<Account> | null>(null)

  override ngOnInit() {
    super.ngOnInit()
    this.accountTreesService.fetch()
    this.contactService.fetch()
  }

  onAssetAccountChange(node: TreeNode<Account> | null) {
    this.assetAccount.set(node)
    this.formValue.update(value => ({...value, assetAccountCode: node?.key ?? ''}))
  }

  resetForm() {
    this.loanForm().reset(LoanFormDefinition.createDefaultFormModel())
    this.assetAccount.set(null)
  }

  save() {
    this.loanService.createLoan(
      LoanFormDefinition.convertToRequest(this.formValue()),
      {onSuccess: () => this.loanCreated.emit()}
    )
  }
}
