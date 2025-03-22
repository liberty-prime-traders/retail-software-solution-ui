import {AsyncPipe} from '@angular/common'
import {Component, effect, inject, input, model, OnInit, signal} from '@angular/core'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {UnitValue} from '../../../../api/unit-value/unitvalue.model'
import {UnitValueService} from '../../../../api/unit-value/unitvalue.service'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {AddRowComponent} from '../../../reusable/add-row/add-row.component'
import {HasGridComponent} from '../../../reusable/has-grid.component'
import {UnitValueFormComponent} from './unit-value-form/unit-value-form.component'

@Component({
  standalone: true,
  selector: 'rts-unit-value',
  templateUrl: 'unit-value.component.html',
  imports: [
    TableModule,
    AsyncPipe,
    NullSafePipe,
    Button,
    UnitValueFormComponent,
    AddRowComponent,
    AddRowComponent,
    NullSafePipe
  ]
})
export class UnitValueComponent extends HasGridComponent<UnitValueService> implements OnInit {
  readonly unitGroupId = input<string>()
  private readonly unitValueService = inject(UnitValueService)
  readonly loading$ = this.unitValueService.selectLoading$()
  readonly processingIsUnderWay$ = this.unitValueService.processingIsUnderWay$()
  readonly unitValues$ = this.unitValueService.selectAll$()
  selectedUnitValue = model<UnitValue|undefined>(undefined)

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
