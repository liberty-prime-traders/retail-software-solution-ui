import {Component, effect, inject, input, OnInit, signal} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {UnitValueService} from '../../../../api/unit-value/unitvalue.service'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {AddRowComponent} from '../../../reusable/add-row/add-row.component'
import {HasGridComponent} from '../../../reusable/has-grid.component'
import {UnitValueFormComponent} from './unit-value-form/unit-value-form.component'

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
    NullSafePipe
  ]
})
export class UnitValueComponent extends HasGridComponent<UnitValueService> implements OnInit {
  readonly unitGroupId = input<EntityId>()

  private readonly unitValueService = inject(UnitValueService)

  protected override readonly fetchByDefault = false
  readonly loading = this.unitValueService.selectLoading
  readonly processingIsUnderWay = this.unitValueService.processingIsUnderWay
  readonly unitValues = this.unitValueService.selectAll

  readonly apiService = this.unitValueService
  readonly addingIsActive = signal(false)
  readonly rowIsExpanded = signal<boolean>(false)

  constructor() {
    super()
    effect(() => {
      if (this.unitGroupId()) {
        this.unitValueService.refetch(this.unitGroupId())
      }
    })
  }
}
