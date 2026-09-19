import {Injectable} from '@angular/core'
import {BaseService} from '../../util/base-api/base.service'
import {PlatformSysUser} from './platform-sys-user.model'
import {PlatformSysUserStore} from './platform-sys-user.store'

@Injectable({ providedIn: 'root' })
export class PlatformSysUserService extends BaseService<PlatformSysUser> {
  constructor(protected override readonly store: PlatformSysUserStore) {
    super(store)
  }
}
