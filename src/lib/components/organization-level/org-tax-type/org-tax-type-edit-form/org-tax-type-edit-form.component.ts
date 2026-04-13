import {Component, inject, Input, OnInit, signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {form, FormField} from '@angular/forms/signals'
import {TreeNode} from 'primeng/api'
import {Select} from 'primeng/select'
import {TreeSelect} from 'primeng/treeselect'
import {AccountTreesService} from '../../../../api/organization-level/account-trees/account-trees.service'
import {OrgFeatureService} from '../../../../api/organization-level/org-feature/org-feature.service'
import {OrgTaxTypeStatus} from '../../../../api/organization-level/org-tax-type/org-tax-type-status.enum'
import {OrgTaxType} from '../../../../api/organization-level/org-tax-type/org-tax-type.model'
import {OrgTaxTypeService} from '../../../../api/organization-level/org-tax-type/org-tax-type.service'
import {TaxRecoveryType} from '../../../../api/platform-level/tax-type/tax-recovery-type.enum'
import {EnumToDropdownPipe} from '../../../../utils/pipes/enum-to-dropdown.pipe'
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
      this.selectedPayableNode.set(null)
      this.selectedRecoverableNode.set(null)
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

  readonly selectedPayableNode = signal<TreeNode<string> | null>(null)
  readonly selectedRecoverableNode = signal<TreeNode<string> | null>(null)

  override ngOnInit() {
    super.ngOnInit()
    if (this.isCoaEnabled()) {
      this.accountTreesService.fetch()
    }
  }

  onPayableChange(node: TreeNode<string> | null) {
    this.selectedPayableNode.set(node)
    this.formValue.update(v => ({...v, payableAccountCode: node?.key as string ?? ''}))
  }

  onRecoverableChange(node: TreeNode<string> | null) {
    this.selectedRecoverableNode.set(node)
    this.formValue.update(v => ({...v, recoverableAccountCode: node?.key as string ?? ''}))
  }

  resetForm() {
    this.formValue.set(OrgTaxTypeEditFormDefinition.convertToFormModel(this.originalTaxType() ?? undefined))
    this.selectedPayableNode.set(null)
    this.selectedRecoverableNode.set(null)
  }

  save() {
    this.orgJurisdictionTaxTypeService.put(
      OrgTaxTypeEditFormDefinition.convertToBackendModel(this.formValue())
    )
  }

}
