import {Component, effect, inject, input, OnInit, signal, untracked} from '@angular/core'
import {FormField, form} from '@angular/forms/signals'
import {EntityId} from '@ngrx/signals/entities'
import {isNil} from 'lodash-es'
import {InputText} from 'primeng/inputtext'
import {Location} from 'lib/api/organization-level/location/location.model'
import {LocationService} from 'lib/api/organization-level/location/location.service'
import {FormButtonsComponent} from 'lib/components/reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from 'lib/components/reusable/form-field/form-field.component'
import {LocationFormDefinition} from 'lib/components/organization-level/locations/location-form.definition'

@Component({
  standalone: true,
  selector: 'rts-location-form',
  templateUrl: './location-form.component.html',
  imports: [
    FormButtonsComponent,
    InputText,
    FormFieldComponent,
    FormField
  ]
})
export class LocationFormComponent implements OnInit {
  private readonly locationService = inject(LocationService)

  readonly location = input<Location>()
  readonly organizationId = input<EntityId | undefined>()

  readonly processingStatus = this.locationService.selectProcessingStatus
  readonly failureMessages = this.locationService.selectFailureMessages

  readonly locationFormModel = signal<LocationFormDefinition.LocationFormModel>(
    LocationFormDefinition.defaultLocationFormModel
  )

  readonly locationForm = form(
    this.locationFormModel,
    LocationFormDefinition.locationFormSchema
  )

  readonly locationFieldMap = LocationFormDefinition.fieldMap

  constructor() {
    effect(() => {
      const current = this.location()
      untracked(() => {
        this.locationFormModel.set(
          LocationFormDefinition.convertToFormModel(current)
        )
      })
    })
  }

  ngOnInit() { this.locationService.resetProcessingStatus() }

  resetForm() {
    this.locationFormModel.set(
      LocationFormDefinition.convertToFormModel(this.location())
    )
  }

  upsertLocation() {
    const updatedLocation: Partial<Location> = {
      ...LocationFormDefinition.convertToBackendModel(this.locationFormModel()),
      organizationId: this.organizationId()
    }

    if (isNil(updatedLocation.id) || updatedLocation.id === '') {
      this.locationService.post(updatedLocation)
    } else {
      this.locationService.put(updatedLocation)
    }
  }

  deleteLocation() { this.locationService.delete(this.location()?.id) }
}
