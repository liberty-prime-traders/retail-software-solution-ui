import {AsyncPipe} from '@angular/common'
import {Component, inject, model, OnInit, signal} from '@angular/core'
import {isNil, sortBy} from 'lodash-es'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {delay, filter, Subscription} from 'rxjs'
import {first, tap} from 'rxjs/operators'
import {AddRowComponent} from '../../reusable/add-row/add-row.component'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {NullishToZeroPipe} from '../../../utils/pipes/nullish-to-zero.pipe'
import {HasSubscriptionComponent} from '../../reusable/has-subscription.component'
import {UnitGroupService} from '../../../api/unit-group/unitgroup.service'
import {UnitGroup} from '../../../api/unit-group/unitgroup.model'
import {ProcessingStatus} from '../../../utils/types/processing-status.enum'
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
export class UnitGroupComponent extends HasSubscriptionComponent implements OnInit {
  private readonly unitGroupService = inject(UnitGroupService)
  readonly loading$ = this.unitGroupService.selectLoading$()
  readonly processingIsUnderWay$ = this.unitGroupService.processingIsUnderWay$()
  readonly unitGroups$ = this.unitGroupService.selectAll$()
  selectedUnitGroup = model<UnitGroup|undefined>(undefined)

  readonly addingIsActive = signal(false)
  readonly rowIsExpanded = signal<boolean>(false)

  ngOnInit() {
    this.unitGroupService.fetch()
    this.subscriptions.add(this.listenToUnitGroupSaveStatus())
    this.subscriptions.add(this.selectUnitGroupOnInitialLoad())
  }

  private listenToUnitGroupSaveStatus(): Subscription {
    return this.unitGroupService.processingStatus$().pipe(
      filter(status => status === ProcessingStatus.SUCCESS),
      delay(500),
      tap(() => this.closeAddRow())
    )
      .subscribe()
  }

  closeAddRow() {
    this.addingIsActive.set(false)
    this.rowIsExpanded.set(false)
  }

  private selectUnitGroupOnInitialLoad(): Subscription {
    return this.unitGroupService.selectAll$().pipe(
      filter(unitgroups => !isNil(unitgroups) && unitgroups.length > 0),
      first(),
      tap(unitgroups => this.selectedUnitGroup.set(sortBy(unitgroups, ['name']).at(0)))
    )
      .subscribe()
  }
}
