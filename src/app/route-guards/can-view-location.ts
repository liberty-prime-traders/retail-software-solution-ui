import {inject, Injectable} from '@angular/core'
import {CanActivate, Router} from '@angular/router'
import {RtsOktaService} from '../../lib/utils/services/rts-okta.service'
import {SessionContextService} from '../../lib/utils/services/session-context.service'

@Injectable({providedIn: 'root'})
export class CanViewLocation implements CanActivate {
  private readonly router = inject(Router)
  private readonly sessionContextService = inject(SessionContextService)
  private readonly oktaService = inject(RtsOktaService)

  canActivate(): boolean {
    if (!this.oktaService.$isLoggedIn()) {
      this.router.navigate(['/secure']).then()
      return false
    }
    if (!this.sessionContextService.selectedLocation()) {
      this.router.navigate(['/secure/select-location']).then()
      return false
    }
    return true
  }
}
