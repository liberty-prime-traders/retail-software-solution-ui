import {inject, Injectable} from '@angular/core'
import {CanActivate, CanActivateChild, GuardResult, MaybeAsync, Router} from '@angular/router'
import {AuthenticationService} from '../../lib/api/platform-level/authentication/authentication.service'
import {RtsGoogleAuthService} from '../../lib/utils/services/auth/rts-google-auth.service'
import {LOGGED_OUT_ROUTE} from '../app.routes'

@Injectable({providedIn: 'root'})
export class AuthenticatedGuard implements CanActivate, CanActivateChild {
  private readonly router = inject(Router)
  private readonly authenticationService = inject(AuthenticationService)
  private readonly googleAuthService = inject(RtsGoogleAuthService)

  canActivate(): MaybeAsync<GuardResult> {
    if (this.authenticationService.isLoggedIn()) {
      return true
    }
    return this.tryRenewSession()
  }

  canActivateChild(): MaybeAsync<GuardResult> {
    return this.canActivate()
  }

  private tryRenewSession(): Promise<boolean> {
    const credential = this.googleAuthService.storedCredential()
    if (!credential) {
      this.redirectToLoggedOut()
      return Promise.resolve(false)
    }

    return new Promise<boolean>(resolve => {
      this.authenticationService.logInWithGoogle(credential, {
        onSuccess: () => resolve(true),
        onFail: () => {
          this.googleAuthService.clearStoredCredential()
          this.redirectToLoggedOut()
          resolve(false)
        }
      })
    })
  }

  private redirectToLoggedOut(): void {
    this.router.navigate([`${LOGGED_OUT_ROUTE}`]).then()
  }
}
