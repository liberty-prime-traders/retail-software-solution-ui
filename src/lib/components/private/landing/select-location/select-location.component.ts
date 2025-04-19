import {CommonModule} from '@angular/common'
import {Component, inject, OnInit} from '@angular/core'
import {ReactiveFormsModule} from '@angular/forms'
import {Router} from '@angular/router'
import {Button} from 'primeng/button'
import {Select} from 'primeng/select'
import {Location} from '../../../../api/location/location.model'
import {LocationService} from '../../../../api/location/location.service'
import {LocalStorageService} from '../../../../utils/services/local-storage.service'
import {LocalStorageKey} from '../../../../utils/types/local-storage-key.enum'
import {FormFieldDirection} from '../../../reusable/form-field/form-field-direction'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {HasSubscriptionComponent} from '../../../reusable/has-subscription.component'

@Component({
  selector: 'rts-select-location',
  templateUrl: 'select-location.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Select,
    Button,
    FormFieldComponent
  ]
})
export class SelectLocationComponent extends HasSubscriptionComponent implements OnInit {
  private readonly router = inject(Router)
  private readonly localStorageService = inject(LocalStorageService)
  private readonly locationService = inject(LocationService)

  protected readonly FormFieldDirection = FormFieldDirection
  protected readonly locations$ = this.locationService.selectAll$()
  protected readonly loading$ = this.locationService.selectLoading$()

  ngOnInit() {
    const storedLocation = this.localStorageService.getItem<Location>(LocalStorageKey.LOCATION)
    if (storedLocation?.id) {
      this.router.navigate(['/secure']).then()
    } else {
      this.locationService.refetch()
    }
  }

  proceedToLocation(selectedLocation: Location) {
    this.localStorageService.setItem(LocalStorageKey.LOCATION, selectedLocation)
    this.router.navigate(['/secure']).then()
  }
}
