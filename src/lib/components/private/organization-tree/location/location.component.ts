import {Component, effect, inject, input, model, signal} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {Location} from '../../../../api/location/location.model'
import {LocationService} from '../../../../api/location/location.service'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {NullishToZeroPipe} from '../../../../utils/pipes/nullish-to-zero.pipe'
import {PrettifyEnumPipe} from '../../../../utils/pipes/prettify-enum.pipe'
import {AddRowComponent} from '../../../reusable/add-row/add-row.component'
import {HasGridComponent} from '../../../reusable/has-grid.component'
import {LocationFormComponent} from './location-form/location-form.component'

@Component({
  selector: 'rts-location',
  templateUrl: 'location.component.html',
  imports: [
    AddRowComponent,
    Button,
    NullSafePipe,
    NullishToZeroPipe,
    TableModule,
    LocationFormComponent,
    PrettifyEnumPipe
  ]
})
export class LocationComponent extends HasGridComponent<LocationService> {
  private readonly locationService = inject(LocationService)

  readonly organizationId = input<EntityId>()
  readonly loading = this.locationService.selectLoading
  readonly locations = this.locationService.selectAll
  readonly processingIsUnderWay = this.locationService.processingIsUnderWay

  readonly apiService = this.locationService
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
}
