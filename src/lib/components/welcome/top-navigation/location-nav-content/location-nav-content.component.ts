import {Component, computed, inject, OnInit, Signal} from '@angular/core'
import {Router} from '@angular/router'
import {Location} from '../../../../api/organization-level/location/location.model'
import {LocationService} from '../../../../api/organization-level/location/location.service'
import {SessionContextService} from '../../../../utils/services/session-context.service'
import {LoadingContainerComponent} from '../../../reusable/loading-container/loading-container.component'

@Component({
  selector: 'rts-location-nav-content',
  templateUrl: 'location-nav-content.component.html',
  imports: [
    LoadingContainerComponent
  ]
})
export class LocationNavContentComponent implements OnInit{
  private readonly sessionContextService = inject(SessionContextService)
  private readonly locationService = inject(LocationService)
  private readonly router = inject(Router)

  readonly locations: Signal<Location[]> = this.locationService.selectAll
  protected readonly loading = this.locationService.selectLoading
  readonly selectedLocationId = computed(() => this.sessionContextService.selectedLocation()?.id)

  selectLocation(location: Location) {
    this.sessionContextService.selectLocation(location)
    this.router.navigate(['/secure/location-dashboard']).then()
    setTimeout(() => window.location.reload(), 200)
  }

  ngOnInit() {
    this.locationService.fetch()
  }
}
