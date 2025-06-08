import {ExpirableAssignment} from '../util/expirable-assignment.model'

export interface OrganizationAdmin extends ExpirableAssignment {
  organizationId?: string
}
