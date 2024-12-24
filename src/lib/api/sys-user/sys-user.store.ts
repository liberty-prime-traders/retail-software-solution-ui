import {Injectable} from '@angular/core'
import {StoreConfig} from '@datorama/akita'
import {createInitialState} from '../base-api/base.state'
import {BaseStore} from '../base-api/base.store'
import {SysUser} from './sys-user.model'
import {SysUserState} from './sys-user.state'

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'users'})
export class SysUserStore extends BaseStore<SysUser, SysUserState> {
    constructor() {
        super(createInitialState())
    }
}
