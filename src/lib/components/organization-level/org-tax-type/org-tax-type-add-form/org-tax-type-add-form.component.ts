import {Component, computed, inject, model, OnInit, output, signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {applyEach, form} from '@angular/forms/signals'
import {TreeNode} from 'primeng/api'
import {Button} from 'primeng/button'
import {TreeSelect} from 'primeng/treeselect'
import {AccountTreesService} from '../../../../api/organization-level/account-trees/account-trees.service'
import {
  AvailableTaxTypesService
} from '../../../../api/organization-level/available-tax-types/available-tax-types.service'
import {OrgFeatureService} from '../../../../api/organization-level/org-feature/org-feature.service'
import {OrgTaxTypeService} from '../../../../api/organization-level/org-tax-type/org-tax-type.service'
import {TaxRecoveryType} from '../../../../api/platform-level/tax-type/tax-recovery-type.enum'
import {RtsTreeNode} from '../../../../utils/types/rts-tree-node'
import {LoadingContainerComponent} from '../../../reusable/loading-container/loading-container.component'
import {OrgTaxTypeAddFormDefinition} from './org-tax-type-add-form.definition'

@Component({
  selector: 'rts-org-tax-type-add-form',
  templateUrl: 'org-tax-type-add-form.component.html',
  imports: [
    Button,
    TreeSelect,
    FormsModule,
    LoadingContainerComponent
  ]
})
export class OrgTaxTypeAddFormComponent implements OnInit {

  private readonly orgJurisdictionTaxTypeService = inject(OrgTaxTypeService)
  private readonly availableTaxTypesService = inject(AvailableTaxTypesService)
  private readonly accountTreesService = inject(AccountTreesService)
  private readonly orgFeatureService = inject(OrgFeatureService)

  readonly allSaved = output<void>()

  readonly availableTaxTypes = this.availableTaxTypesService.selectAll
  readonly taxTypeTreeIsLoading = this.availableTaxTypesService.selectLoading
  readonly selectedTaxNodes = model<RtsTreeNode.EntityTreeNode<TaxRecoveryType>[]>([])
  readonly processingStatus = this.orgJurisdictionTaxTypeService.selectProcessingStatus
  readonly failureMessages = this.orgJurisdictionTaxTypeService.selectFailureMessages
  readonly orgTaxTypesLoading = this.orgJurisdictionTaxTypeService.selectLoading
  readonly taxTypesToAdd = signal<OrgTaxTypeAddFormDefinition.AddRowModel[]>([])

  readonly isCoaEnabled = this.orgFeatureService.isChartOfAccountsEnabled
  readonly payableAccounts = this.accountTreesService.payable
  readonly recoverableAccounts = this.accountTreesService.recoverable
  readonly accountTreesLoading = this.accountTreesService.selectLoading

  readonly canSave = computed(() =>
    this.taxTypesToAdd().length > 0
      && this.selectedTaxNodes().length === 0
      && this.taxTypesToAddForm().valid()
  )

  readonly taxTypesToAddForm = form(
    this.taxTypesToAdd,
    (path) => applyEach(path, OrgTaxTypeAddFormDefinition.rowFormSchema)
  )

  ngOnInit() {
    this.orgJurisdictionTaxTypeService.resetProcessingStatus()
    this.availableTaxTypesService.refetch()
    if (this.isCoaEnabled()) {
      this.accountTreesService.fetch()
    }
  }

  confirmSelection() {
    const alreadyAddedNodeIds = new Set(this.taxTypesToAdd().map(row => row.jurisdictionTaxTypeId))
    const newTaxTypes: OrgTaxTypeAddFormDefinition.AddRowModel[] = this.selectedTaxNodes()
      .filter(node => !alreadyAddedNodeIds.has(node.key!))
      .map(node => ({
        jurisdictionTaxTypeId: node.key!,
        label: node.label!,
        taxRecoveryType: node.data ?? '',
        payableAccountCode: '',
        recoverableAccountCode: ''
      }))

    this.taxTypesToAdd.update(current => [...current, ...newTaxTypes])
    this.selectedTaxNodes.set([])
  }

  removeRow(jurisdictionTaxTypeId: string) {
    this.taxTypesToAdd.update(rows => rows.filter(row => row.jurisdictionTaxTypeId !== jurisdictionTaxTypeId))
  }

  onPayableChange(jurisdictionTaxTypeId?: string, node?: TreeNode<string>) {
    this.taxTypesToAdd.update(rows =>
      rows.map((row) =>
        row.jurisdictionTaxTypeId === jurisdictionTaxTypeId ? {...row, payableAccountCode: node?.key!} : row
      )
    )
  }

  onRecoverableChange(jurisdictionTaxTypeId?: string, node?: TreeNode<string>) {
    this.taxTypesToAdd.update(rows =>
      rows.map((row) =>
        row.jurisdictionTaxTypeId === jurisdictionTaxTypeId ? {...row, recoverableAccountCode: node?.key!} : row
      )
    )
  }

  saveAll() {
    const payload = this.taxTypesToAdd().map(OrgTaxTypeAddFormDefinition.convertToBackendModel)
    this.orgJurisdictionTaxTypeService.post(payload, {onSuccess: () => this.allSaved.emit()})
  }

  protected readonly TaxRecoveryType = TaxRecoveryType
}
