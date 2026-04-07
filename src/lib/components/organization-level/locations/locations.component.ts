import {NgClass} from '@angular/common'
import {Component, computed, inject, model} from '@angular/core'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {Location} from '../../../api/organization-level/location/location.model'
import {LocationService} from '../../../api/organization-level/location/location.service'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../utils/pipes/prettify-enum.pipe'
import {SessionContextService} from '../../../utils/services/session-context.service'
import {AddRowComponent} from '../../reusable/add-row/add-row.component'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'
import {GridFilterComponent} from '../../reusable/grid-filter/grid-filter.component'
import {GridWithAddButtonComponent} from '../../reusable/grid-with-add-button.component'
import {LocationFormComponent} from './location-form/location-form.component'

@Component({
  selector: 'rts-locations',
  templateUrl: 'locations.component.html',
  imports: [
    TableModule,
    NullSafePipe,
    PrettifyEnumPipe,
    Button,
    LocationFormComponent,
    AddRowComponent,
    GridFilterComponent,
    EmptyRowComponent,
    NgClass
  ]
})
export class LocationsComponent extends GridWithAddButtonComponent<LocationService> {
  private readonly locationService = inject(LocationService)
  private readonly sessionContext = inject(SessionContextService)

  readonly apiService = this.locationService

  readonly locations = this.locationService.selectAll
  selectedLocation = model<Location | undefined>(undefined)

  readonly organizationId = computed(() => this.sessionContext.selectedOrganization()?.id)
}
