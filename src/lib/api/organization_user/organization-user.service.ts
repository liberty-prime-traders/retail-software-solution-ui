import {Injectable} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {BaseService} from '../util/base-api/base.service'
import {OrganizationUser} from './organization-user.model'
import {OrganizationUserStore} from './organization-user.store'

@Injectable({providedIn: 'root'})
export class OrganizationUserService extends BaseService<OrganizationUser, Array<EntityId>> {
  constructor(protected override readonly store: OrganizationUserStore) {
    super(store)
  }

  terminateUsers$(organizationUserIds: Array<EntityId>) {
    this.patchApiRequestConfig({upsertOnSuccess: true, urlSuffix: 'terminate'})
    this.post(organizationUserIds)
  }
}
