import {Injectable} from '@angular/core'
import {BaseQuery} from '../base-api/base.query'
import {SysUser} from './sys-user.model'
import {SysUserState} from './sys-user.state'
import {SysUserStore} from './sys-user.store'

@Injectable({providedIn: 'root'})
export class SysUserQuery extends BaseQuery<SysUser, SysUserState> {
    constructor(protected override readonly store: SysUserStore) {
        super(store)
    }
}
