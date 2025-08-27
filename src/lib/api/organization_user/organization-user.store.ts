import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../util/base-api/base.store'
import {OrganizationUser} from './organization-user.model'

@Injectable({providedIn: 'root'})
export class OrganizationUserStore extends createBaseStore<OrganizationUser>()
  implements BaseStore<OrganizationUser> {
  readonly basePath = 'organization-users'
}
