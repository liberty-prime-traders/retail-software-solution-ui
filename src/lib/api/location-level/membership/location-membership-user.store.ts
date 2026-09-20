import {Injectable} from '@angular/core'
import {MembershipUserSummary} from '../../cross-tier/authorization/membership-user-summary.model'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'

@Injectable({ providedIn: 'root' })
export class LocationMembershipUserStore extends createBaseStore<MembershipUserSummary>((entity) => entity.userId)
  implements BaseStore<MembershipUserSummary> {

  readonly basePath = 'location-users'
}
