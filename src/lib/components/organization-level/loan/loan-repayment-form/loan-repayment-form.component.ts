import {Component, inject, input, OnInit, output, signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {form, FormField} from '@angular/forms/signals'
import {TreeNode} from 'primeng/api'
import {DatePicker} from 'primeng/datepicker'
import {InputNumber} from 'primeng/inputnumber'
import {InputText} from 'primeng/inputtext'
import {TreeSelect} from 'primeng/treeselect'
import {AccountTreesService} from '../../../../api/organization-level/account-trees/account-trees.service'
import {Account} from '../../../../api/organization-level/chart-of-accounts/account.model'
import {Loan} from '../../../../api/organization-level/loan/loan.model'
import {LoanService} from '../../../../api/organization-level/loan/loan.service'
import {BaseFormComponent} from '../../../reusable/base-form.component'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {LoadingContainerComponent} from '../../../reusable/loading-container/loading-container.component'
import {LoanRepaymentFormDefinition} from './loan-repayment-form.definition'

@Component({
  selector: 'rts-loan-repayment-form',
  templateUrl: 'loan-repayment-form.component.html',
  imports: [
    FormsModule,
    FormField,
    FormButtonsComponent,
    FormFieldComponent,
    LoadingContainerComponent,
    DatePicker,
    InputNumber,
    InputText,
    TreeSelect
  ]
})
export class LoanRepaymentFormComponent extends BaseFormComponent<LoanService> implements OnInit {
  private readonly loanService = inject(LoanService)
  private readonly accountTreesService = inject(AccountTreesService)
  protected override readonly apiService = this.loanService

  readonly loan = input.required<Loan>()
  readonly repaymentRecorded = output<void>()

  readonly formValue = signal<LoanRepaymentFormDefinition.LoanRepaymentFormModel>(
    LoanRepaymentFormDefinition.createDefaultFormModel()
  )
  readonly repaymentForm = form(
    this.formValue,
    LoanRepaymentFormDefinition.createFormSchema(() => this.loan().outstanding)
  )
  readonly fieldMap = LoanRepaymentFormDefinition.fieldMap

  readonly loanTrees = this.accountTreesService.loans
  readonly accountTreesLoading = this.accountTreesService.selectLoading

  readonly assetAccount = signal<TreeNode<Account> | null>(null)

  override ngOnInit() {
    super.ngOnInit()
    this.accountTreesService.fetch()
  }

  onAssetAccountChange(node: TreeNode<Account> | null) {
    this.assetAccount.set(node)
    this.formValue.update(value => ({...value, assetAccountCode: node?.key ?? ''}))
  }

  resetForm() {
    this.repaymentForm().reset(LoanRepaymentFormDefinition.createDefaultFormModel())
    this.assetAccount.set(null)
  }

  save() {
    this.loanService.recordRepayment(
      LoanRepaymentFormDefinition.convertToRequest(String(this.loan().id), this.formValue()),
      {onSuccess: () => this.repaymentRecorded.emit()}
    )
  }
}
