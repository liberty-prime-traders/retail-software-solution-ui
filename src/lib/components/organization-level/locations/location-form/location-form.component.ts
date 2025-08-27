import {Component, computed, inject, input, OnInit} from '@angular/core'
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms'
import {EntityId} from '@ngrx/signals/entities'
import {isNil} from 'lodash-es'
import {DropdownModule} from 'primeng/dropdown'
import {InputText} from 'primeng/inputtext'
import {Select} from 'primeng/select'
import {LocationType} from '../../../../api/organization-level/location/location-type.enum'
import {Location} from '../../../../api/organization-level/location/location.model'
import {LocationService} from '../../../../api/organization-level/location/location.service'
import {EnumToDropdownPipe} from '../../../../utils/pipes/enum-to-dropdown.pipe'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'

@Component({
  selector: 'rts-location-form',
  templateUrl: 'location-form.component.html',
  imports: [
    FormButtonsComponent,
    FormsModule,
    InputText,
    ReactiveFormsModule,
    DropdownModule,
    EnumToDropdownPipe,
    Select,
    FormFieldComponent
  ]
})
export class LocationFormComponent implements OnInit {
  readonly location = input<Location>()
  readonly organizationId = input<EntityId>()

  private readonly locationService = inject(LocationService)
  private readonly formBuilder = inject(FormBuilder)

  readonly locationForm = computed(() => this.formBuilder.nonNullable.group({
    id: this.location()?.id,
    name: [this.location()?.name, Validators.required],
    description: this.location()?.description,
    locationType: [this.location()?.locationType, Validators.required]
  }))

  readonly locationType = LocationType
  readonly processingStatus = this.locationService.selectProcessingStatus
  readonly failureMessages = this.locationService.selectFailureMessages

  ngOnInit() {
    this.locationService.resetProcessingStatus()
  }

  resetForm() {
    this.locationForm().reset(this.location())
  }

  upsertLocation() {
    const updatedLocation: Partial<Location> = {
      ...this.locationForm().getRawValue(),
      organizationId: this.organizationId()
    }
    if (isNil(updatedLocation.id)) {
      this.locationService.post(updatedLocation)
    } else {
      this.locationService.put(updatedLocation)
    }
  }

  deleteLocation() {
    this.locationService.delete(this.location()?.id)
  }
}
