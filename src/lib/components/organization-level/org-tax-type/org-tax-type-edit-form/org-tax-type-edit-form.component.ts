import {Component, inject, Input, model, OnInit, signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {form, FormField} from '@angular/forms/signals'
import {TreeNode} from 'primeng/api'
import {Select} from 'primeng/select'
import {TreeSelect} from 'primeng/treeselect'
import {AccountTreesService} from '../../../../api/organization-level/account-trees/account-trees.service'
import {Account} from '../../../../api/organization-level/chart-of-accounts/account.model'
import {OrgFeatureService} from '../../../../api/organization-level/org-feature/org-feature.service'
import {OrgTaxTypeStatus} from '../../../../api/organization-level/org-tax-type/org-tax-type-status.enum'
import {OrgTaxType} from '../../../../api/organization-level/org-tax-type/org-tax-type.model'
import {OrgTaxTypeService} from '../../../../api/organization-level/org-tax-type/org-tax-type.service'
import {TaxRecoveryType} from '../../../../api/platform-level/tax-type/tax-recovery-type.enum'
import {EnumToDropdownPipe} from '../../../../utils/pipes/enum-to-dropdown.pipe'
import {RtsTreeNode} from '../../../../utils/types/rts-tree-node'
import {BaseFormComponent} from '../../../reusable/base-form.component'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {OrgTaxTypeEditFormDefinition} from './org-tax-type-edit-form.definition'

@Component({
  selector: 'rts-org-tax-type-edit-form',
  templateUrl: 'org-tax-type-edit-form.component.html',
  imports: [
    FormButtonsComponent,
    FormFieldComponent,
    Select,
    FormField,
    EnumToDropdownPipe,
    TreeSelect,
    FormsModule
  ]
})
export class OrgTaxTypeEditFormComponent extends BaseFormComponent<OrgTaxTypeService> implements OnInit {

  private readonly orgJurisdictionTaxTypeService = inject(OrgTaxTypeService)
  private readonly accountTreesService = inject(AccountTreesService)
  private readonly orgFeatureService = inject(OrgFeatureService)
  protected override readonly apiService = this.orgJurisdictionTaxTypeService

  @Input()
  set orgJurisdictionTaxType(entity: OrgTaxType | null) {
    if (entity) {
      this.originalTaxType.set(entity)
      this.formValue.set(OrgTaxTypeEditFormDefinition.convertToFormModel(entity))
      this.selectedPayableNode.set(this.findOriginalPayableNode())
      this.selectedRecoverableNode.set(this.findOriginalRecoverableNode())
    }
  }

  readonly formValue = signal<OrgTaxTypeEditFormDefinition.EditFormModel>(
    OrgTaxTypeEditFormDefinition.defaultFormModel
  )

  private readonly originalTaxType = signal<OrgTaxType | null>(null)
  readonly editForm = form(this.formValue, OrgTaxTypeEditFormDefinition.formSchema)
  readonly fieldMap = OrgTaxTypeEditFormDefinition.fieldMap
  readonly OrgTaxTypeStatus = OrgTaxTypeStatus
  protected readonly TaxRecoveryType = TaxRecoveryType

  readonly isCoaEnabled = this.orgFeatureService.isChartOfAccountsEnabled
  readonly payableAccounts = this.accountTreesService.payable
  readonly recoverableAccounts = this.accountTreesService.recoverable
  readonly accountTreesLoading = this.accountTreesService.selectLoading

  readonly selectedPayableNode = model<TreeNode<Account> | null>()
  readonly selectedRecoverableNode = model<TreeNode<Account> | null>()

  override ngOnInit() {
    super.ngOnInit()
    if (this.isCoaEnabled()) {
      this.accountTreesService.fetch()
    }
  }

  onPayableChange() {
    const code = this.selectedPayableNode()?.key ?? ''
    if (code !== this.formValue().payableAccountCode) {
      this.formValue.update(v => ({...v, payableAccountCode: code}))
      this.editForm().markAsDirty()
    }
  }

  onRecoverableChange() {
    const code = this.selectedRecoverableNode()?.key ?? ''
    if (code !== this.formValue().recoverableAccountCode) {
      this.formValue.update(v => ({...v, recoverableAccountCode: code}))
      this.editForm().markAsDirty()
    }
  }

  resetForm() {
    this.selectedPayableNode.set(this.findOriginalPayableNode())
    this.selectedRecoverableNode.set(this.findOriginalRecoverableNode())
    this.editForm().reset(OrgTaxTypeEditFormDefinition.convertToFormModel(this.originalTaxType()))
  }

  private findOriginalPayableNode(): TreeNode<Account> | null {
    return RtsTreeNode.findNode(this.originalTaxType()?.payableAccountCode, this.payableAccounts())
  }

  private findOriginalRecoverableNode(): TreeNode<Account> | null {
    return RtsTreeNode.findNode(this.originalTaxType()?.recoverableAccountCode, this.recoverableAccounts())
  }

  save() {
    this.orgJurisdictionTaxTypeService.put(
      OrgTaxTypeEditFormDefinition.convertToBackendModel(this.formValue())
    )
  }

}
