import {AsyncPipe} from '@angular/common'
import {Component, inject, model, OnInit, signal} from '@angular/core'
import {isNil, sortBy} from 'lodash-es'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {filter, Subscription} from 'rxjs'
import {first, tap} from 'rxjs/operators'
import {UnitGroup} from '../../../api/unit-group/unitgroup.model'
import {UnitGroupService} from '../../../api/unit-group/unitgroup.service'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {NullishToZeroPipe} from '../../../utils/pipes/nullish-to-zero.pipe'
import {AddRowComponent} from '../../reusable/add-row/add-row.component'
import {HasGridComponent} from '../../reusable/has-grid.component'
import {UnitGroupFormComponent} from './unit-group-form/unit-group-form.component'

@Component({
  standalone: true,
  selector: 'rts-unit-group',
  templateUrl: 'unit-group.component.html',
  imports: [
    TableModule,
    AsyncPipe,
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
export class UnitGroupComponent extends HasGridComponent<UnitGroupService> implements OnInit {
  private readonly unitGroupService = inject(UnitGroupService)
  readonly loading$ = this.unitGroupService.selectLoading$()
  readonly processingIsUnderWay$ = this.unitGroupService.processingIsUnderWay$()
  readonly unitGroups$ = this.unitGroupService.selectAll$()
  selectedUnitGroup = model<UnitGroup|undefined>(undefined)

  readonly apiService = this.unitGroupService
  readonly addingIsActive = signal(false)
  readonly rowIsExpanded = signal<boolean>(false)

  override ngOnInit() {
    super.ngOnInit()
    this.subscriptions.add(this.selectUnitGroupOnInitialLoad())
  }

  private selectUnitGroupOnInitialLoad(): Subscription {
    return this.unitGroupService.selectAll$().pipe(
      filter(unitGroups => !isNil(unitGroups) && unitGroups.length > 0),
      first(),
      tap(unitGroups => this.selectedUnitGroup.set(sortBy(unitGroups, ['name']).at(0)))
    ).subscribe()
    
  }
}
