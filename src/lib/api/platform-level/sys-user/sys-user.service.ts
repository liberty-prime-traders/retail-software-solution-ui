import {computed, inject, Injectable} from '@angular/core'
import {distinctUntilChanged, filter} from 'rxjs'
import {tap} from 'rxjs/operators'
import {RtsOktaService} from '../../../utils/services/rts-okta.service'
import {BaseService} from '../../util/base-api/base.service'
import {SysUser} from './sys-user.model'
import {SysUserStore} from './sys-user.store'

@Injectable({providedIn: 'root'})
export class SysUserService extends BaseService<SysUser> {

  private readonly oktaService = inject(RtsOktaService)

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

    this.oktaService.loggedIn$.pipe(
      distinctUntilChanged(),
      filter(isLoggedIn => Boolean(isLoggedIn)),
      tap(() => this.fetch())
    ).subscribe()
  }
}
