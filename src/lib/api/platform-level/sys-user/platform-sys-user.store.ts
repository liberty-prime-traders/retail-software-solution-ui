import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {PlatformSysUser} from './platform-sys-user.model'

@Injectable({ providedIn: 'root' })
export class PlatformSysUserStore extends createBaseStore<PlatformSysUser>() implements BaseStore<PlatformSysUser> {
  readonly basePath = 'platform-users'
}
