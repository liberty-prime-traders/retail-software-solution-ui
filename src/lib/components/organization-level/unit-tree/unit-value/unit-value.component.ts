import {Component, effect, inject, input, OnInit, signal} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {UnitValueService} from '../../../../api/unit-value/unitvalue.service'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {AddRowComponent} from '../../../reusable/add-row/add-row.component'
import {GridFilterComponent} from '../../../reusable/grid-filter/grid-filter.component'
import {HasEditableGridComponent} from '../../../reusable/has-editable-grid.component'
import {UnitValueFormComponent} from './unit-value-form/unit-value-form.component'
import {EmptyRowComponent} from '../../../reusable/empty-row/empty-row.component'

@Component({
  selector: 'rts-unit-value',
  templateUrl: 'unit-value.component.html',
  imports: [
    TableModule,
    NullSafePipe,
    Button,
    UnitValueFormComponent,
    AddRowComponent,
    AddRowComponent,
    NullSafePipe,
    GridFilterComponent,
    EmptyRowComponent
  ]
})
export class UnitValueComponent extends HasEditableGridComponent<UnitValueService> implements OnInit {
  readonly unitGroupId = input<EntityId>()

  private readonly unitValueService = inject(UnitValueService)

  readonly loading = this.unitValueService.selectLoading
  readonly unitValues = this.unitValueService.selectAll

  readonly apiService = this.unitValueService
  readonly addingIsActive = signal(false)
  readonly rowIsExpanded = signal<boolean>(false)

  constructor() {
    super()
    effect(() => {
      if (this.unitGroupId()) {
        // TODO: Uncomment when proper checks are in place to avoid infinite loops
        // this.unitValueService.refetch(this.unitGroupId())
      }
    })
  }

  override ngOnInit() {
    //super.ngOnInit()
  }
}
