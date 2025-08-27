import {Organization} from './organization.model'

export interface OrganizationLaunchResponse {
  organization?: Organization
  isOrganizationAdmin?: boolean
  accessRequested?: boolean
}
