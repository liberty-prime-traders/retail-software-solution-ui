import {NgClass} from '@angular/common'
import {Component, effect, inject, input, model} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {Location} from '../../../api/organization-level/location/location.model'
import {LocationService} from '../../../api/organization-level/location/location.service'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {NullishToZeroPipe} from '../../../utils/pipes/nullish-to-zero.pipe'
import {PrettifyEnumPipe} from '../../../utils/pipes/prettify-enum.pipe'
import {AddRowComponent} from '../../reusable/add-row/add-row.component'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'
import {GridWithAddButtonComponent} from '../../reusable/grid-with-add-button.component'
import {LocationFormComponent} from './location-form/location-form.component'

@Component({
  selector: 'rts-location',
  templateUrl: 'locations.component.html',
  imports: [
    AddRowComponent,
    Button,
    NullSafePipe,
    NullishToZeroPipe,
    TableModule,
    LocationFormComponent,
    PrettifyEnumPipe,
    GridFilterComponent,
    EmptyRowComponent,
    NgClass
  ]
})
export class LocationsComponent extends GridWithAddButtonComponent<LocationService> {
  private readonly locationService = inject(LocationService)

  readonly apiService = this.locationService

  readonly organizationId = input<EntityId>()
  readonly locations = this.locationService.selectAll
  readonly selectedLocation = model<Location | undefined>()

  constructor() {
    super()
    effect(() => {
      if (this.organizationId()) {
        this.locationService.refetch(this.organizationId())
      }
    })
  }
}
