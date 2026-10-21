import {Component, computed, inject, OnInit, output, signal} from '@angular/core'
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
import {FundMovementService} from '../../../../api/organization-level/fund-transfer/fund-movement.service'
import {FundMovementType} from '../../../../api/organization-level/fund-transfer/fund-movement-type.enum'
import {getToday} from '../../../../utils/dates'
import {EnumToDropdownPipe} from '../../../../utils/pipes/enum-to-dropdown.pipe'
import {AutoStretchDirective} from '../../../reusable/auto-stretch.directive'
import {BaseFormComponent} from '../../../reusable/base-form.component'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {LoadingContainerComponent} from '../../../reusable/loading-container/loading-container.component'
import {FundTransferFormDefinition} from './fund-transfer-form.definition'

@Component({
  selector: 'rts-fund-transfer-form',
  templateUrl: 'fund-transfer-form.component.html',
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
    TreeSelect,
    EnumToDropdownPipe,
    AutoStretchDirective
  ]
})
export class FundTransferFormComponent extends BaseFormComponent<FundMovementService> implements OnInit {
  private readonly fundMovementService = inject(FundMovementService)
  private readonly accountTreesService = inject(AccountTreesService)
  protected override readonly apiService = this.fundMovementService

  readonly fundMovementCreated = output<void>()

  readonly FundMovementType = FundMovementType
  readonly today = getToday()
  readonly formValue = signal<FundTransferFormDefinition.FundTransferFormModel>(
    FundTransferFormDefinition.createDefaultFormModel()
  )
  readonly fundTransferForm = form(this.formValue, FundTransferFormDefinition.formSchema)
  readonly fieldMap = FundTransferFormDefinition.fieldMap

  readonly isTransfer = computed(() => this.formValue().type === FundMovementType.TRANSFER_BETWEEN_ACCOUNTS)
  readonly accountLabel = computed(() =>
    this.formValue().type === FundMovementType.CONTRIBUTE_CAPITAL_TO_BUSINESS ? 'Paid Into Account' : 'Paid From Account'
  )

  readonly fundMovementTrees = this.accountTreesService.fundMovements
  readonly accountTreesLoading = this.accountTreesService.selectLoading

  readonly fromAccount = signal<TreeNode<Account> | null>(null)
  readonly toAccount = signal<TreeNode<Account> | null>(null)
  readonly account = signal<TreeNode<Account> | null>(null)

  override ngOnInit() {
    super.ngOnInit()
    this.accountTreesService.fetch()
  }

  onFromAccountChange(node: TreeNode<Account> | null) {
    this.fromAccount.set(node)
    this.formValue.update(value => ({...value, fromAccountCode: node?.key ?? ''}))
  }

  onToAccountChange(node: TreeNode<Account> | null) {
    this.toAccount.set(node)
    this.formValue.update(value => ({...value, toAccountCode: node?.key ?? ''}))
  }

  onAccountChange(node: TreeNode<Account> | null) {
    this.account.set(node)
    this.formValue.update(value => ({...value, accountCode: node?.key ?? ''}))
  }

  resetForm() {
    this.fundTransferForm().reset(FundTransferFormDefinition.createDefaultFormModel())
    this.fromAccount.set(null)
    this.toAccount.set(null)
    this.account.set(null)
  }

  save() {
    const formValue = this.formValue()
    const callbacks = {onSuccess: () => this.fundMovementCreated.emit()}
    switch (formValue.type) {
      case FundMovementType.TRANSFER_BETWEEN_ACCOUNTS:
        this.fundMovementService.createTransfer(FundTransferFormDefinition.convertToTransferRequest(formValue), callbacks)
        break
      case FundMovementType.CONTRIBUTE_CAPITAL_TO_BUSINESS:
        this.fundMovementService.createCapital(FundTransferFormDefinition.convertToCapitalRequest(formValue), callbacks)
        break
      case FundMovementType.WITHDRAW_FOR_PERSONAL_USE:
        this.fundMovementService.createDraw(FundTransferFormDefinition.convertToDrawRequest(formValue), callbacks)
        break
    }
  }
}
