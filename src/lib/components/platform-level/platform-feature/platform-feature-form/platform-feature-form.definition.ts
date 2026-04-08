import {required, schema} from '@angular/forms/signals'
import {PlatformFeature} from '../../../../api/platform-level/platform-feature/platform-feature.model'

export namespace PlatformFeatureFormDefinition {

  export interface PlatformFeatureFormModel {
    id: string
    description: string
  }

  export const fieldMap = new Map<keyof PlatformFeatureFormModel, string>([
    ['description', 'Description']
  ])

  export const defaultPlatformFeatureFormModel: PlatformFeatureFormModel = {
    id: '',
    description: ''
  }

  export const platformFeatureFormSchema = schema<PlatformFeatureFormModel>((path) => {
    required(path.description)
  })

  export const convertToFormModel = (platformFeature?: PlatformFeature): PlatformFeatureFormModel => ({
    id: platformFeature?.id as string ?? '',
    description: platformFeature?.description ?? ''
  })

  export const convertToBackendModel = (formValue: PlatformFeatureFormModel): Partial<PlatformFeature> => ({
    id: formValue.id,
    description: formValue.description
  })
}
