import {Component, computed, inject, model, OnInit, output, signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {applyEach, form} from '@angular/forms/signals'
import {Button} from 'primeng/button'
import {TreeSelect} from 'primeng/treeselect'
import {
  OrgTaxTypeService
} from '../../../../api/organization-level/org-tax-type/org-tax-type.service'
import {
  AvailableTaxTypesService
} from '../../../../api/organization-level/available-tax-types/available-tax-types.service'
import {
  AvailableTaxTypesNode
} from '../../../../api/organization-level/available-tax-types/available-tax-types.node'
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

  readonly allSaved = output<void>()

  readonly availableTaxTypes = this.availableTaxTypesService.selectAll
  readonly taxTypeTreeIsLoading = this.availableTaxTypesService.selectLoading
  readonly selectedTaxNodes = model<AvailableTaxTypesNode[]>([])
  readonly processingStatus = this.orgJurisdictionTaxTypeService.selectProcessingStatus
  readonly failureMessages = this.orgJurisdictionTaxTypeService.selectFailureMessages
  readonly orgTaxTypesLoading = this.orgJurisdictionTaxTypeService.selectLoading
  readonly taxTypesToAdd = signal<OrgTaxTypeAddFormDefinition.AddRowModel[]>([])

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
  }

  confirmSelection() {
    const alreadyAddedNodeIds = new Set(this.taxTypesToAdd().map(row => row.jurisdictionTaxTypeId))
    const newTaxTypes = this.selectedTaxNodes()
      .filter(node => !alreadyAddedNodeIds.has(node.key!))
      .map(node => ({
        jurisdictionTaxTypeId: node.key!,
        label: node.label!
      }))

    this.taxTypesToAdd.update(current => [...current, ...newTaxTypes])
    this.selectedTaxNodes.set([])
  }

  removeRow(jurisdictionTaxTypeId: string) {
    this.taxTypesToAdd.update(rows => rows.filter(row => row.jurisdictionTaxTypeId !== jurisdictionTaxTypeId))
  }

  saveAll() {
    const payload = this.taxTypesToAdd().map(OrgTaxTypeAddFormDefinition.convertToBackendModel)
    this.orgJurisdictionTaxTypeService.post(payload, {onSuccess: () => this.allSaved.emit()})
  }
}
