import {computed, inject, Injectable, Signal, signal} from '@angular/core'
import {tap} from 'rxjs/operators'
import {AuthenticationService} from '../../../api/platform-level/authentication/authentication.service'
import {
  OrganizationAdminService
} from '../../../api/platform-level/organization/organization-admin/organization-admin.service'
import {UserRole} from '../../types/user-role.enum'

@Injectable({ providedIn: 'root' })
export class UserContextService {
  private readonly authenticationService = inject(AuthenticationService)
  private readonly organizationAdminService = inject(OrganizationAdminService)

  private readonly _isOrganizationAdmin = signal<boolean>(false)

  private readonly loggedInUser = this.authenticationService.loggedInUser
  private readonly loginResponse = this.authenticationService.loginResponse
  readonly isOrganizationAdmin = this._isOrganizationAdmin.asReadonly()
  readonly displayName = computed(() => this.loggedInUser()?.firstName ?? '')
  readonly emailAddress = computed(() => this.loggedInUser()?.email ?? '')
  readonly token = computed(() => this.loginResponse()?.sessionToken ?? '')
  readonly isPlatformAdmin = this.hasRole(UserRole.PLATFORM_ADMIN)
  readonly hasCreateRole = this.hasRole(UserRole.CREATE_ORGANIZATION)

  readonly initials = computed(() => {
    const u = this.loggedInUser()
    if (!u) return ''
    return `${u.firstName[0]}${u.lastName[0]}`.toUpperCase()
  })


  hasRole(role: UserRole): Signal<boolean> {
    return computed(() => this.loginResponse()?.verifiedRoles.includes(role) ?? false)
  }

  checkOrganizationAdminStatus(): void {
    this.organizationAdminService.isOrganizationAdmin$().pipe(
      tap(isAdmin => this._isOrganizationAdmin.set(isAdmin))
    ).subscribe()
  }

  signOut() {
    this.authenticationService.resetStoreAndClearCache()
  }
}
