import {computed, inject, Injectable, Signal, signal} from '@angular/core'
import {tap} from 'rxjs/operators'
import {UserPermission} from '../../../api/cross-tier/authorization/user-permission.enum'
import {AuthenticationService} from '../../../api/platform-level/authentication/authentication.service'
import {
  OrganizationAdminService
} from '../../../api/platform-level/organization/organization-admin/organization-admin.service'
import {UserRole} from '../../../api/cross-tier/authorization/user-role.enum'
import {RtsGoogleAuthService} from './rts-google-auth.service'

@Injectable({ providedIn: 'root' })
export class UserContextService {
  private readonly authenticationService = inject(AuthenticationService)
  private readonly organizationAdminService = inject(OrganizationAdminService)
  private readonly googleAuthService = inject(RtsGoogleAuthService)

  private readonly _isOrganizationAdmin = signal<boolean>(false)

  private readonly loggedInUser = this.authenticationService.loggedInUser
  private readonly loginResponse = this.authenticationService.loginResponse
  readonly isOrganizationAdmin = this._isOrganizationAdmin.asReadonly()
  readonly userFullName = computed(() => this.loggedInUser()?.fullName ?? '')
  readonly emailAddress = computed(() => this.loggedInUser()?.email ?? '')
  readonly token = computed(() => this.loginResponse()?.sessionToken ?? '')
  readonly isPlatformAdmin = this.hasRole(UserRole.PLATFORM_ADMIN)
  readonly canCreateOrganization = this.hasPermission(UserPermission.CREATE_ORGANIZATION)
  readonly initials = computed(() =>  this.loggedInUser()?.initials ?? '')

  private hasRole(role: UserRole): Signal<boolean> {
    return computed(() => this.loginResponse()?.verifiedRoles.includes(role) ?? false)
  }

  private hasPermission(permission: UserPermission): Signal<boolean> {
    return computed(() => this.loginResponse()?.verifiedPermissions.includes(permission) ?? false)
  }

  checkOrganizationAdminStatus(): void {
    this.organizationAdminService.isOrganizationAdmin$().pipe(
      tap(isAdmin => this._isOrganizationAdmin.set(isAdmin))
    ).subscribe()
  }

  signOut() {
    this.googleAuthService.clearStoredCredential()
    this.authenticationService.resetStoreAndClearCache()
  }
}
