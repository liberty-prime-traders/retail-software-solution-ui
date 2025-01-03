import {AsyncPipe} from '@angular/common'
import {Component, effect, inject, input, model, OnInit, signal} from '@angular/core'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {delay, filter, Subscription} from 'rxjs'
import {tap} from 'rxjs/operators'
import {Location} from '../../../../api/location/location.model'
import {LocationService} from '../../../../api/location/location.service'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {NullishToZeroPipe} from '../../../../utils/pipes/nullish-to-zero.pipe'
import {PrettifyEnumPipe} from '../../../../utils/pipes/prettify-enum.pipe'
import {ProcessingStatus} from '../../../../utils/types/processing-status.enum'
import {AddRowComponent} from '../../../reusable/add-row/add-row.component'
import {HasSubscriptionComponent} from '../../../reusable/has-subscription.component'
import {LocationFormComponent} from './location-form/location-form.component'

@Component({
  standalone: true,
  selector: 'rts-location',
  templateUrl: 'location.component.html',
  imports: [
    AddRowComponent,
    AsyncPipe,
    Button,
    NullSafePipe,
    NullishToZeroPipe,
    TableModule,
    LocationFormComponent,
    PrettifyEnumPipe
  ]
})
export class LocationComponent extends HasSubscriptionComponent implements OnInit {
  private readonly locationService = inject(LocationService)

  readonly organizationId = input<string>()
  readonly loading$ = this.locationService.selectLoading$()
  readonly locations$ = this.locationService.selectAll$()
  readonly processingIsUnderWay$ = this.locationService.processingIsUnderWay$()

  readonly addingIsActive = signal(false)
  readonly rowIsExpanded = signal<boolean>(false)
  readonly selectedLocation = model<Location|undefined>()

  constructor() {
    super()
    effect(() => {
      if (this.organizationId()) {
        this.locationService.refetch(this.organizationId())
      }
    })
  }

  ngOnInit() {
    this.subscriptions.add(this.listenToLocationSaveStatus())
  }

  private listenToLocationSaveStatus(): Subscription {
    return this.locationService.processingStatus$().pipe(
      filter(status => status === ProcessingStatus.SUCCESS),
      delay(500),
      tap(() => this.addingIsActive.set(false))
    )
      .subscribe()
  }
}
