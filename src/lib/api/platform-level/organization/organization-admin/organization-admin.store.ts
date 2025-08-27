import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../../util/base-api/base.store'
import {OrganizationAdmin} from './organization-admin.model'

@Injectable({providedIn: 'root'})
export class OrganizationAdminStore extends createBaseStore<OrganizationAdmin>()
  implements BaseStore<OrganizationAdmin> {
  readonly basePath = 'organization-admins'
}
