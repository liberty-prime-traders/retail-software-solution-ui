import {AsyncPipe} from '@angular/common'
import {Component, effect, inject, input, OnInit, signal} from '@angular/core'
import {SelectItem} from 'primeng/api'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {Observable} from 'rxjs'
import {map} from 'rxjs/operators'
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
  
  protected override readonly fetchByDefault = false
  readonly loading$ = this.unitValueService.selectLoading$()
  readonly processingIsUnderWay$ = this.unitValueService.processingIsUnderWay$()
  readonly unitValues$ = this.unitValueService.selectAll$()

  readonly apiService = this.unitValueService
  readonly addingIsActive = signal(false)
  readonly rowIsExpanded = signal<boolean>(false)
  readonly baseUnitOptions$: Observable<Array<SelectItem<string>>> = this.unitValues$.pipe(
    map(unitValues => unitValues.map(unit => (
      {label: unit.name ?? 'Unknown', value: unit.id ?? ''}
    )))
  )

  constructor() {
    super()
    effect(() => {
      if (this.unitGroupId()) {
        this.unitValueService.refetch(this.unitGroupId())
      }
    })
  }
}
