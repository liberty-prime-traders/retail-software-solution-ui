import {Injectable} from '@angular/core'
import {UserAccessDetailService} from '../../cross-tier/authorization/user-access-detail.service'
import {OrgUserAccessDetailStore} from './org-user-access-detail.store'

@Injectable({ providedIn: 'root' })
export class OrgUserAccessDetailService extends UserAccessDetailService {
  constructor(protected override readonly store: OrgUserAccessDetailStore) {
    super(store)
  }
}
