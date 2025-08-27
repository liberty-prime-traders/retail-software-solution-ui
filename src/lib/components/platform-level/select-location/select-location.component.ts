import {CommonModule} from '@angular/common'
import {Component, inject, OnInit, Signal} from '@angular/core'
import {ReactiveFormsModule} from '@angular/forms'
import {ActivatedRoute, Router} from '@angular/router'
import {Button} from 'primeng/button'
import {Card} from 'primeng/card'
import {Select} from 'primeng/select'
import {Location} from '../../../api/organization-level/location/location.model'
import {LocationService} from '../../../api/organization-level/location/location.service'
import {LocalStorageService} from '../../../utils/services/local-storage.service'
import {RoutingContextService} from '../../../utils/services/routing-context.service'
import {SessionContextService} from '../../../utils/services/session-context.service'
import {LocalStorageKey} from '../../../utils/types/local-storage-key.enum'
import {FormFieldDirection} from '../../reusable/form-field/form-field-direction'
import {FormFieldComponent} from '../../reusable/form-field/form-field.component'
import {HasSubscriptionComponent} from '../../reusable/has-subscription.component'

@Component({
  selector: 'rts-select-location',
  templateUrl: 'select-location.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Select,
    Button,
    FormFieldComponent,
    Card
  ]
})
export class SelectLocationComponent extends HasSubscriptionComponent implements OnInit {
  private readonly router = inject(Router)
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly localStorageService = inject(LocalStorageService)
  private readonly sessionContextService = inject(SessionContextService)
  private readonly locationService = inject(LocationService)
  private readonly routingContextService = inject(RoutingContextService)

  protected readonly FormFieldDirection = FormFieldDirection
  protected readonly locations: Signal<Location[]> = this.locationService.selectAll
  protected readonly loading = this.locationService.selectLoading

  ngOnInit() {
    if (this.sessionContextService.organizationIsSelected()) {
      this.checkForStoredLocation()
    } else {
      this.router.navigate(['..'], {relativeTo: this.activatedRoute}).then()
    }
  }

  private checkForStoredLocation() {
    const storedLocation = this.localStorageService.getItem<Location>(LocalStorageKey.LOCATION)
    if (storedLocation?.id) {
      this.proceedToLocation(storedLocation)
    } else {
      this.locationService.refetch()
    }
  }

  proceedToLocation(selectedLocation: Location) {
    this.sessionContextService.updateSelectedLocation(selectedLocation)
    const rerouteTo = this.routingContextService.returnTo() ?? '/secure/location-dashboard'
    this.routingContextService.clearReturnTo()
    this.router.navigate([rerouteTo]).then()
  }
}
