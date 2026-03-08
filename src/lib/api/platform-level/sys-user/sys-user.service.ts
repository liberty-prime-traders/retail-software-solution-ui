import {computed, Injectable} from '@angular/core'
import {BaseService} from '../../util/base-api/base.service'
import {SysUser} from './sys-user.model'
import {SysUserStore} from './sys-user.store'

@Injectable({providedIn: 'root'})
export class SysUserService extends BaseService<SysUser> {

  override readonly selectAll = computed(() =>
    this.userStore.entities().map(user => {
      let fullName = user.firstName
      if (user.lastName) {
        fullName += ` ${user.lastName}`
      }
      return {...user, fullName}
    })
  )

  constructor(protected readonly userStore: SysUserStore) {
    super(userStore)
  }
}
