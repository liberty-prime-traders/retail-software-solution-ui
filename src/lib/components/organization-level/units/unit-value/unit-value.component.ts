import {NgClass} from '@angular/common'
import {Component, inject, input, OnInit} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {Button} from 'primeng/button'
import {Ripple} from 'primeng/ripple'
import {TableModule} from 'primeng/table'
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
export class UnitValueComponent extends GridWithAddButtonComponent<UnitValueService> implements OnInit {
  readonly unitGroupId = input.required<EntityId>()

  private readonly unitValueService = inject(UnitValueService)
  readonly apiService = this.unitValueService

  readonly unitValues = this.unitValueService.selectForGroup(this.unitGroupId)


  override ngOnInit() {
    this.unitValueService.refetch(this.unitGroupId())
  }
}
