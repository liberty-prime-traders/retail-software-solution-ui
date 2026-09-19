import {Injectable} from '@angular/core'
import {UserAccessDetailService} from '../../cross-tier/authorization/user-access-detail.service'
import {LocationUserAccessDetailStore} from './location-user-access-detail.store'

@Injectable({ providedIn: 'root' })
export class LocationUserAccessDetailService extends UserAccessDetailService {
  constructor(protected override readonly store: LocationUserAccessDetailStore) {
    super(store)
  }
}
