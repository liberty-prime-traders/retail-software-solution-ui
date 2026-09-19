import {Injectable} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {ApiCallbacks} from '../../util/base-api/api-callbacks'
import {BaseService} from '../../util/base-api/base.service'
import {MembershipUserSummary} from '../../cross-tier/authorization/membership-user-summary.model'
import {OrgMembershipUserStore} from './org-membership-user.store'

@Injectable({ providedIn: 'root' })
export class OrgMembershipUserService extends BaseService<MembershipUserSummary, Array<EntityId>> {
  constructor(protected override readonly store: OrgMembershipUserStore) {
    super(store)
  }

  terminateUsers(organizationUserIds: Array<EntityId>,
                 apiCallbacks: ApiCallbacks<MembershipUserSummary>
  ) {
    this.patchApiRequestConfig({upsertOnSuccess: true, urlSuffix: 'terminate'})
    this.post(organizationUserIds, apiCallbacks)
  }
}
