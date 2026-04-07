import {NgClass, NgTemplateOutlet} from '@angular/common'
import {Component, computed, effect, inject, model, OnInit, signal} from '@angular/core'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {Accordion, AccordionContent, AccordionHeader, AccordionPanel} from 'primeng/accordion'
import {BlockUI} from 'primeng/blockui'
import {Button} from 'primeng/button'
import {Divider} from 'primeng/divider'
import {UnitGroup} from '../../../api/organization-level/unit-group/unitgroup.model'
import {UnitGroupService} from '../../../api/organization-level/unit-group/unitgroup.service'
import {AutoStretchDirective} from '../../reusable/auto-stretch.directive'
import {GridWithAddButtonComponent} from '../../reusable/grid-with-add-button.component'
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
    AccordionContent,
    BlockUI,
    AutoStretchDirective
  ]
})
export class UnitTreeComponent extends GridWithAddButtonComponent<UnitGroupService> implements OnInit {
  private readonly unitGroupService = inject(UnitGroupService)
  override readonly apiService = this.unitGroupService
  readonly unitGroups = this.unitGroupService.selectAll

  readonly searchTerm = signal('')
  private readonly selectedUnitGroupStash = signal<UnitGroup|undefined>(undefined)
  readonly selectedUnitGroup = model<UnitGroup| undefined>(undefined)
  private readonly canMakeInitialSelection = signal(true)

  private readonly makeInitialSelection = effect(() => {
    const firstUnitGroup = this.unitGroups().at(0)
    if (this.canMakeInitialSelection() && firstUnitGroup) {
      this.selectedUnitGroup.set(firstUnitGroup)
      this.canMakeInitialSelection.set(false)
    }
  })

  readonly filteredUnits = computed(() => {
    const term = this.searchTerm().toLowerCase()
    return this.unitGroups().filter(unit =>
      unit.name?.toLowerCase().includes(term) ||
      unit.description?.toLowerCase().includes(term)
    )
  })

  selectUnit(product: UnitGroup) {
    this.selectedUnitGroup.set(product)
  }

  override setAddingActiveTrue() {
    this.addingIsActive.set(true)
    this.selectedUnitGroupStash.set(this.selectedUnitGroup())
    this.selectedUnitGroup.set(undefined)
  }

  override setAddingActiveFalse() {
    this.addingIsActive.set(false)
    this.selectedUnitGroup.set(this.selectedUnitGroupStash())
  }

  unitGroupCreated(saved: UnitGroup) {
    this.setAddingActiveFalse()
    this.selectedUnitGroup.set(saved)
  }
}
