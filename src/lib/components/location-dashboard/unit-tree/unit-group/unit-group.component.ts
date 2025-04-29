import {Component, effect, inject, model, signal} from '@angular/core'
import {sortBy} from 'lodash-es'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {UnitGroup} from '../../../../api/unit-group/unitgroup.model'
import {UnitGroupService} from '../../../../api/unit-group/unitgroup.service'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {NullishToZeroPipe} from '../../../../utils/pipes/nullish-to-zero.pipe'
import {AddRowComponent} from '../../../reusable/add-row/add-row.component'
import {HasGridComponent} from '../../../reusable/has-grid.component'
import {UnitGroupFormComponent} from './unit-group-form/unit-group-form.component'

@Component({
  selector: 'rts-unit-group',
  templateUrl: 'unit-group.component.html',
  imports: [
    TableModule,
    NullishToZeroPipe,
    NullSafePipe,
    Button,
    UnitGroupFormComponent,
    AddRowComponent,
    AddRowComponent,
    NullSafePipe,
    NullishToZeroPipe
  ]
})
export class UnitGroupComponent extends HasGridComponent<UnitGroupService> {
  private readonly unitGroupService = inject(UnitGroupService)
  readonly loading = this.unitGroupService.selectLoading
  readonly processingIsUnderWay = this.unitGroupService.processingIsUnderWay
  readonly unitGroups = this.unitGroupService.selectAll
  selectedUnitGroup = model<UnitGroup|undefined>(undefined)

  readonly apiService = this.unitGroupService
  readonly addingIsActive = signal(false)
  readonly rowIsExpanded = signal<boolean>(false)
  private readonly unitGroupsInitialized = signal(false)

  constructor() {
    super()
    effect(() => {
      const unitGroups = this.unitGroupService.selectAll()
      this.selectUnitGroupOnInitialLoad(unitGroups)
    })
  }

  private selectUnitGroupOnInitialLoad(unitGroups: UnitGroup[]) {
    if (!this.unitGroupsInitialized() && unitGroups.length > 0) {
      this.unitGroupsInitialized.set(true)
      this.selectedUnitGroup.set(sortBy(unitGroups, ['name']).at(0))
    }
  }
}
