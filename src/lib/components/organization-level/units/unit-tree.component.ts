import {NgClass, NgTemplateOutlet} from '@angular/common'
import {Component, computed, inject, model, OnInit, signal} from '@angular/core'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel} from 'primeng/accordion'
import {Button} from 'primeng/button'
import {Divider} from 'primeng/divider'
import {UnitGroup} from '../../../api/organization-level/unit-group/unitgroup.model'
import {UnitGroupService} from '../../../api/organization-level/unit-group/unitgroup.service'
import {AutoStretchComponent} from '../../reusable/auto-stretch.component'
import {AutoResizeConfig} from '../../welcome/auto-resize-config'
import {UnitGroupFormComponent} from './unit-group-form/unit-group-form.component'
import {UnitValueComponent} from './unit-value/unit-value.component'

@Component({
  selector: 'rts-unit-tree',
  templateUrl: 'unit-tree.component.html',
  imports: [
    Button,
    Divider,
    ReactiveFormsModule,
    FormsModule,
    NgClass,
    UnitGroupFormComponent,
    UnitValueComponent,
    NgTemplateOutlet,
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent
  ]
})
export class UnitTreeComponent extends AutoStretchComponent implements OnInit {
  private readonly unitGroupService = inject(UnitGroupService)
  readonly loading = this.unitGroupService.selectLoading
  readonly unitGroups = this.unitGroupService.selectAll

  readonly unitsElementId = AutoResizeConfig.unitsId
  readonly addingIsActive = signal(false)
  readonly rowIsExpanded = signal<boolean>(false)
  readonly searchTerm = signal('')
  private readonly selectedUnitGroupStash = signal<UnitGroup|undefined>(undefined)
  readonly selectedUnitGroup = model<UnitGroup| undefined>(undefined)

  readonly filteredUnits = computed(() => {
    const term = this.searchTerm().toLowerCase()
    return this.unitGroups().filter(unit =>
      unit.name?.toLowerCase().includes(term) ||
      unit.description?.toLowerCase().includes(term)
    )
  })

  ngOnInit() {
    this.unitGroupService.fetch()
  }

  selectUnit(product: UnitGroup) {
    this.selectedUnitGroup.set(product)
  }

  setAddingActiveTrue() {
    this.addingIsActive.set(true)
    this.selectedUnitGroupStash.set(this.selectedUnitGroup())
    this.selectedUnitGroup.set(undefined)
  }

  setAddingActiveFalse() {
    this.addingIsActive.set(false)
    this.selectedUnitGroup.set(this.selectedUnitGroupStash())
  }

  successfulSave() {
    this.setAddingActiveFalse()
    this.selectedUnitGroup.set(this.unitGroupService.lastSavedResponse())
  }
}
