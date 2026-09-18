import {computed, Injectable} from '@angular/core'
import {Subscription} from 'rxjs'
import {ProcessingStatus} from '../../../utils/types/processing-status.enum'
import {UserRole} from '../../../utils/types/user-role.enum'
import {ApiCallbacks} from '../../util/base-api/api-callbacks'
import {BaseService} from '../../util/base-api/base.service'
import {AuthenticationStore} from './authentication.store'
import {IdentityProvider, LoginRequest, LoginResponse} from './login.model'

@Injectable({providedIn: 'root'})
export class AuthenticationService extends BaseService<LoginResponse, LoginRequest> {

  private static readonly ROLES_TO_VERIFY = [UserRole.CREATE_ORGANIZATION, UserRole.PLATFORM_ADMIN]

  readonly loginResponse = computed(() => this.selectFirst())
  readonly loggedInUser = computed(() => this.loginResponse()?.user)
  readonly isLoggedIn = computed(() => this.selectProcessingStatus() === ProcessingStatus.SUCCESS)
  readonly isAuthenticating = computed(() => this.selectProcessingStatus() === ProcessingStatus.IN_PROGRESS)

  constructor(protected override readonly store: AuthenticationStore) {
    super(store)
  }

  logInWithGoogle(credential: string, callbacks: ApiCallbacks<LoginResponse>): void {
    this.logIn(IdentityProvider.GOOGLE, credential, callbacks)
  }

  logIn(provider: IdentityProvider, credential: string, callbacks: ApiCallbacks<LoginResponse>): Subscription {
    this.patchApiRequestConfig({urlSuffix: 'login', urlPrefix: ''})
    return this.post(
      {provider, credential, rolesToVerify: AuthenticationService.ROLES_TO_VERIFY},
      callbacks
    )
  }
}
