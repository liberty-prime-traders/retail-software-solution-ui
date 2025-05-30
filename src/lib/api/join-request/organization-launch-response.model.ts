import {Organization} from '../organization/organization.model'

export interface OrganizationLaunchResponse {
  organization?: Organization
  isOrganizationAdmin?: boolean
  accessRequested?: boolean
}
