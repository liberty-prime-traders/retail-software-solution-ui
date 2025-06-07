import {OrganizationAdmin} from '../organization-admin/organization-admin.model'

export interface OrganizationUser extends Omit<OrganizationAdmin, 'organizationId' | 'admin' | 'name'> {
  joinRequestId?: string;
  user?: string;
}
