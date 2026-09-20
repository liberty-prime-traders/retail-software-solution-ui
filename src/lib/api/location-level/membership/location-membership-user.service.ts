import {Injectable} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {ApiCallbacks} from '../../util/base-api/api-callbacks'
import {MembershipUserService} from '../../cross-tier/authorization/membership-user.service'
import {MembershipUserSummary} from '../../cross-tier/authorization/membership-user-summary.model'
import {LocationMembershipUserStore} from './location-membership-user.store'

@Injectable({ providedIn: 'root' })
export class LocationMembershipUserService extends MembershipUserService {
  constructor(protected override readonly store: LocationMembershipUserStore) {
    super(store)
  }

  pullUsersFromOrg(userIds: Array<EntityId>, apiCallbacks: ApiCallbacks<MembershipUserSummary>) {
    this.patchApiRequestConfig({upsertOnSuccess: true})
    this.post(userIds, apiCallbacks)
  }
}
