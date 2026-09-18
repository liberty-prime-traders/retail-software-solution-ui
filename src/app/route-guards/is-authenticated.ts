import {inject, Injectable} from '@angular/core'
import {CanActivate, CanActivateChild, GuardResult, MaybeAsync, Router} from '@angular/router'
import {AuthenticationService} from '../../lib/api/platform-level/authentication/authentication.service'
import {LOGGED_OUT_ROUTE} from '../app.routes'

@Injectable({providedIn: 'root'})
export class AuthenticatedGuard implements CanActivate, CanActivateChild {
  private readonly router = inject(Router)
  private readonly authenticationService = inject(AuthenticationService)

  canActivate(): MaybeAsync<GuardResult> {
    if (this.authenticationService.isLoggedIn()) {
      return true
    } else {
      this.router.navigate([`${LOGGED_OUT_ROUTE}`]).then()
      return false
    }
  }

  canActivateChild(): MaybeAsync<GuardResult> {
    return this.canActivate()
  }
}
