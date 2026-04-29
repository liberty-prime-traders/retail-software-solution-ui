import {NgClass} from '@angular/common'
import {Component, computed, effect, inject, input, untracked} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {Button} from 'primeng/button'
import {Ripple} from 'primeng/ripple'
import {TableModule} from 'primeng/table'
import {UnitGroup} from '../../../../api/organization-level/unit-group/unitgroup.model'
import {UnitValueService} from '../../../../api/organization-level/unit-value/unitvalue.service'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {EmptyRowComponent} from '../../../reusable/empty-row/empty-row.component'
import {GridFilterComponent} from '../../../reusable/grid-filter/grid-filter.component'
import {GridWithAddButtonComponent} from '../../../reusable/grid-with-add-button.component'
import {UnitValueFormComponent} from './unit-value-form/unit-value-form.component'

@Component({
  selector: 'rts-unit-value',
  templateUrl: 'unit-value.component.html',
  imports: [
    TableModule,
    NullSafePipe,
    Button,
    UnitValueFormComponent,
    NullSafePipe,
    GridFilterComponent,
    EmptyRowComponent,
    Ripple,
    NgClass
  ]
})
export class UnitValueComponent extends GridWithAddButtonComponent<UnitValueService>{
  readonly unitGroup = input.required<UnitGroup>()

  private readonly unitValueService = inject(UnitValueService)
  readonly apiService = this.unitValueService

  readonly unitGroupId = computed(() => this.unitGroup().id as EntityId)
  readonly unitValues = this.unitValueService.selectForGroup(this.unitGroupId)

  private refetchUnitsForGroup = effect(() => {
    const unitGroupId = this.unitGroupId()
    untracked(() => this.unitValueService.refetch(unitGroupId))
  })
}
