import {Injectable} from '@angular/core'
import {UserRole} from '../../cross-tier/authorization/user-role.enum'
import {MultimapBaseService} from '../../util/base-api/multimap-base.service'
import {StandalonePermission} from './standalone-permission.model'
import {StandalonePermissionStore} from './standalone-permission.store'

@Injectable({ providedIn: 'root' })
export class StandalonePermissionService extends MultimapBaseService<StandalonePermission>{

  protected override keyPath: keyof StandalonePermission = 'role'

  constructor(protected override readonly store: StandalonePermissionStore) {
    super(store)
  }

  getForRole(role: UserRole) {
    return this.refetch(role)
  }
}
