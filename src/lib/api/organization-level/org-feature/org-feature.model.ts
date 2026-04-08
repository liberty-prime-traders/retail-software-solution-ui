import {BaseModel} from '../../util/base-api/base.model'
import {Feature} from '../../platform-level/platform-feature/feature.enum'
import {OrganizationFeatureStatus} from './org-feature-status.enum'

export interface OrganizationFeature extends BaseModel {
  feature: Feature
  status: OrganizationFeatureStatus
  enabledOn?: string
  enabledBy?: string
  disabledOn?: string
  disabledBy?: string
}
