import {ExpirableAssignment} from '../util/expirable-assignment.model'

export interface OrganizationUser extends ExpirableAssignment {
  joinRequestId?: string;
}
