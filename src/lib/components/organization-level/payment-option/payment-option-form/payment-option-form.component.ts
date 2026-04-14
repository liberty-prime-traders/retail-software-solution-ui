import {NgClass} from '@angular/common'
import {Component, inject, Input, model, OnInit, output, signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {form, FormField} from '@angular/forms/signals'
import {TreeNode} from 'primeng/api'
import {InputText} from 'primeng/inputtext'
import {TreeSelect} from 'primeng/treeselect'
import {AccountTreesService} from '../../../../api/organization-level/account-trees/account-trees.service'
import {Account} from '../../../../api/organization-level/chart-of-accounts/account.model'
import {PaymentOption} from '../../../../api/organization-level/payment-option/payment-option.model.'
import {PaymentOptionService} from '../../../../api/organization-level/payment-option/payment-option.service'
import {OrgFeatureService} from '../../../../api/organization-level/org-feature/org-feature.service'
import {RtsTreeNode} from '../../../../utils/types/rts-tree-node'
import {BaseFormComponent} from '../../../reusable/base-form.component'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {PaymentOptionFormDefinition} from './payment-option-form.definition'

@Component({
  selector: 'rts-payment-option-form',
  templateUrl: 'payment-option-form.component.html',
  imports: [
    FormButtonsComponent,
    FormFieldComponent,
    FormField,
    InputText,
    TreeSelect,
    FormsModule,
    NgClass
  ]
})
export class PaymentOptionFormComponent extends BaseFormComponent<PaymentOptionService> implements OnInit {

  private readonly paymentOptionService = inject(PaymentOptionService)
  private readonly accountTreesService = inject(AccountTreesService)
  private readonly orgFeatureService = inject(OrgFeatureService)
  protected override readonly apiService = this.paymentOptionService

  readonly paymentOptionCreated = output<void>()

  @Input()
  set paymentOption(entity: PaymentOption | null) {
    if (entity) {
      this.originalPaymentOption.set(entity)
      this.formValue.set(PaymentOptionFormDefinition.convertToFormModel(entity))
      this.linkedAccount.set(this.findOriginalLinkedAccount())
    }
  }

  readonly originalPaymentOption = signal<PaymentOption | undefined>(undefined)
  readonly formValue = signal<PaymentOptionFormDefinition.PaymentOptionFormModel>(
    PaymentOptionFormDefinition.defaultFormModel
  )

  readonly paymentOptionForm = form(this.formValue, PaymentOptionFormDefinition.formSchema)
  readonly fieldMap = PaymentOptionFormDefinition.fieldMap

  readonly linkedAccount = model<TreeNode<Account> | null>()
  readonly isChartOfAccountsEnabled = this.orgFeatureService.isChartOfAccountsEnabled
  readonly paymentMethodTrees = this.accountTreesService.paymentMethods
  readonly accountTreesLoading = this.accountTreesService.selectLoading

  override ngOnInit() {
    super.ngOnInit()
    if (this.isChartOfAccountsEnabled()) {
      this.accountTreesService.fetch()
    }
  }

  onAccountChange() {
    const code = this.linkedAccount()?.key ?? ''
    if (code !== this.formValue().accountCode) {
      this.formValue.update(v => ({...v, accountCode: code}))
      this.paymentOptionForm().markAsDirty()
    }
  }

  resetForm() {
    this.paymentOptionForm().reset(PaymentOptionFormDefinition.convertToFormModel(this.originalPaymentOption()))
    this.linkedAccount.set(this.findOriginalLinkedAccount())
  }

  upsertPaymentOption() {
    const payload = PaymentOptionFormDefinition.convertToBackendModel(this.formValue())
    if (payload.id) {
      this.paymentOptionService.put(payload)
    } else {
      this.paymentOptionService.post(payload, {onSuccess: () => this.paymentOptionCreated.emit()})
    }
  }

  deletePaymentOption() {
    this.paymentOptionService.delete(this.originalPaymentOption()?.id)
  }

  private findOriginalLinkedAccount(): TreeNode<Account> | null {
    return RtsTreeNode.findNode(this.originalPaymentOption()?.accountCode, this.paymentMethodTrees())
  }

}
