import {computed, Injectable} from '@angular/core'
import {Subscription} from 'rxjs'
import {ProcessingStatus} from '../../../utils/types/processing-status.enum'
import {UserPermission} from '../../cross-tier/authorization/user-permission.enum'
import {UserRole} from '../../cross-tier/authorization/user-role.enum'
import {ApiCallbacks} from '../../util/base-api/api-callbacks'
import {BaseService} from '../../util/base-api/base.service'
import {AuthenticationStore} from './authentication.store'
import {IdentityProvider, LoginRequest, LoginResponse} from './login.model'

@Injectable({providedIn: 'root'})
export class AuthenticationService extends BaseService<LoginResponse, LoginRequest> {

  readonly loginResponse = computed(() => this.selectFirst())
  readonly loggedInUser = computed(() => this.loginResponse()?.user)
  readonly isLoggedIn = computed(() => this.selectProcessingStatus() === ProcessingStatus.SUCCESS)
  readonly isAuthenticating = computed(() => this.selectProcessingStatus() === ProcessingStatus.IN_PROGRESS)

  constructor(protected override readonly store: AuthenticationStore) {
    super(store)
  }

  renewSessionToken(sessionToken: string): void {
    const currentLoginResponse = this.loginResponse()
    if (!currentLoginResponse) {
      return
    }
    this.store.setAll([{...currentLoginResponse, sessionToken}])
  }

  // A login upserts, which keeps the previous session first in the store; this replaces it instead.
  replaceLoginResponse(loginResponse: LoginResponse): void {
    this.store.setAll([loginResponse])
  }

  logInWithGoogle(credential: string, callbacks: ApiCallbacks<LoginResponse>): void {
    this.logIn(IdentityProvider.GOOGLE, credential, callbacks)
  }

  logIn(provider: IdentityProvider, credential: string, callbacks: ApiCallbacks<LoginResponse>): Subscription {
    return this.postRequest({
      body: {
        provider,
        credential,
        rolesToVerify: [UserRole.PLATFORM_ADMIN],
        permissionsToVerify: [UserPermission.CREATE_ORGANIZATION]
      },
      callbacks,
      config: {urlSuffix: 'login', urlPrefix: ''}
    })
  }
}
