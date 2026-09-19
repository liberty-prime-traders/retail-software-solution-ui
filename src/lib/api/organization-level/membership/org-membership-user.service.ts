import {Injectable} from '@angular/core'
import {MembershipUserSummary} from '../../cross-tier/authorization/membership-user-summary.model'
import {BaseService} from '../../util/base-api/base.service'
import {OrgMembershipUserStore} from './org-membership-user.store'

@Injectable({ providedIn: 'root' })
export class OrgMembershipUserService extends BaseService<MembershipUserSummary> {
  constructor(protected override readonly store: OrgMembershipUserStore) {
    super(store)
  }
}
