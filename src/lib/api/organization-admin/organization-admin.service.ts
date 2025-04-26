import {Injectable} from '@angular/core'
import {BaseService} from '../base-api/base.service'
import {OrganizationAdmin} from './organization-admin.model'
import {OrganizationAdminStore} from './organization-admin.store'

@Injectable({providedIn: 'root'})
export class OrganizationAdminService extends BaseService<OrganizationAdmin> {
  constructor(protected override readonly store: OrganizationAdminStore) {
    super(store)
  }
}
