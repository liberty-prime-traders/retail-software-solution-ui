import {Injectable} from '@angular/core'
import {MembershipUserSummary} from '../../cross-tier/authorization/membership-user-summary.model'
import {BaseService} from '../../util/base-api/base.service'
import {LocationMembershipUserStore} from './location-membership-user.store'

@Injectable({ providedIn: 'root' })
export class LocationMembershipUserService extends BaseService<MembershipUserSummary> {
  constructor(protected override readonly store: LocationMembershipUserStore) {
    super(store)
  }
}
