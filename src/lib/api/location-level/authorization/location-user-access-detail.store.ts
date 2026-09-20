import {Injectable} from '@angular/core'
import {UserAccessDetail} from '../../cross-tier/authorization/authority.model'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'

@Injectable({ providedIn: 'root' })
export class LocationUserAccessDetailStore extends createBaseStore<UserAccessDetail>((entity) => entity.userId)
  implements BaseStore<UserAccessDetail> {

  readonly basePath = 'location-users/access'
}
