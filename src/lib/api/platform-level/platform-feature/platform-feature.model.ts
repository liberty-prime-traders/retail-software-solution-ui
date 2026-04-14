import {BaseModel} from '../../util/base-api/base.model'
import {Feature} from './feature.enum'

export interface PlatformFeature extends BaseModel {
  feature: Feature
  description?: string
}
