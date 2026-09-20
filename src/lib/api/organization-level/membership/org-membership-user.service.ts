import {Injectable} from '@angular/core'
import {MembershipUserService} from '../../cross-tier/authorization/membership-user.service'
import {OrgMembershipUserStore} from './org-membership-user.store'

@Injectable({ providedIn: 'root' })
export class OrgMembershipUserService extends MembershipUserService {
  constructor(protected override readonly store: OrgMembershipUserStore) {
    super(store)
  }
}
