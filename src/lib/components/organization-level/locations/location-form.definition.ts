import {required, schema} from '@angular/forms/signals'
import {EntityId} from '@ngrx/signals/entities'
import {Location} from '../../../api/organization-level/location/location.model'
import {LocationType} from '../../../api/organization-level/location/location-type.enum'

export namespace LocationFormDefinition {
  export interface LocationFormModel {
    id: EntityId | ''
    name: string
    locationType: LocationType | ''
    description: string
  }

  export const fieldMap = new Map<keyof LocationFormModel, string>(
    [
      ['name', 'Name'],
      ['locationType', 'Location Type'],
      ['description', 'Description']
    ]
  )

  export const defaultLocationFormModel: LocationFormModel = {
    id: '',
    name: '',
    locationType: '',
    description: ''
  }

  export const locationFormSchema = schema<LocationFormModel>(path => {
    required(path.name)
    required(path.locationType)
  })

  export const convertToFormModel = (location?: Location): LocationFormModel => ({
    id: location?.id ?? '',
    name: location?.name ?? '',
    locationType: location?.locationType ?? '',
    description: location?.description ?? ''
  })

  export const convertToBackendModel = (formValue: LocationFormModel): Partial<Location> => ({
    id: formValue.id || undefined,
    name: formValue.name,
    locationType: formValue.locationType || undefined,
    description: formValue.description
  })
}
