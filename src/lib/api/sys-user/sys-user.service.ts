import {Injectable} from '@angular/core'
import {BaseService} from '../base-api/base.service'
import {SysUser} from './sys-user.model'
import {SysUserQuery} from './sys-user.query'
import {SysUserState} from './sys-user.state'
import {SysUserStore} from './sys-user.store'

@Injectable({providedIn: 'root'})
export class SysUserService extends BaseService<SysUser, SysUserState> {
  constructor(protected readonly userStore: SysUserStore,
                protected readonly userQuery: SysUserQuery) {
    super(userStore, userQuery)
  }
}
