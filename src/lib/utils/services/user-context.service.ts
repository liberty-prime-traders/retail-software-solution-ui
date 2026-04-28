import {computed, inject, Injectable, signal} from '@angular/core'
import {toSignal} from '@angular/core/rxjs-interop'
import {filter, switchMap} from 'rxjs'
import {tap} from 'rxjs/operators'
import {
  OrganizationAdminService
} from '../../api/platform-level/organization/organization-admin/organization-admin.service'
import {SysUserService} from '../../api/platform-level/sys-user/sys-user.service'
import {DEFAULT_TIMEZONE} from '../../api/util/timezone.model'
import {UserRole} from '../types/user-role.enum'
import {RtsOktaService} from './rts-okta.service'

@Injectable({ providedIn: 'root' })
export class UserContextService {
  private readonly rtsOktaService = inject(RtsOktaService)
  private readonly organizationAdminService = inject(OrganizationAdminService)
  private readonly userService = inject(SysUserService)

  private readonly _isOrganizationAdmin = signal<boolean>(false)

  private readonly loggedInUser = computed(() =>
    this.userService.selectAll().find(user => user.oktaId === this.rtsOktaService.$oktaId())
  )

  readonly darkMode = signal(false)
  readonly selectedTimezone = signal(DEFAULT_TIMEZONE.value)

  readonly isOrganizationAdmin = this._isOrganizationAdmin.asReadonly()
  readonly displayName = computed(() => this.loggedInUser()?.fullName ?? '')
  readonly emailAddress = computed(() => this.loggedInUser()?.email ?? '')

  readonly isPlatformAdmin = toSignal(
    this.rtsOktaService.loggedIn$.pipe(
      filter((isLoggedIn) => Boolean(isLoggedIn)),
      switchMap(() => this.rtsOktaService.hasRole$(UserRole.ROLE_PLATFORM_ADMIN))
    ),
    {initialValue: false}
  )

  readonly initials = computed(() => {
    const u = this.loggedInUser()
    if (!u) return ''
    return `${u.firstName[0]}${u.lastName[0]}`.toUpperCase()
  })

  checkOrganizationAdminStatus(): void {
    this.organizationAdminService.isOrganizationAdmin$().pipe(
      tap(isAdmin => this._isOrganizationAdmin.set(isAdmin))
    ).subscribe()
  }
}
