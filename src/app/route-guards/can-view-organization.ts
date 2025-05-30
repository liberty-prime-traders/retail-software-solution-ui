import {inject, Injectable} from '@angular/core'
import {CanActivate, Router} from '@angular/router'
import {RoutingContextService} from '../../lib/utils/services/routing-context.service'
import {SessionContextService} from '../../lib/utils/services/session-context.service'

@Injectable({providedIn: 'root'})
export class CanViewOrganization implements CanActivate {
  private readonly router = inject(Router)
  private readonly sessionContextService = inject(SessionContextService)
  private readonly routingContextService = inject(RoutingContextService)

  canActivate(): boolean {
    if (!this.sessionContextService.selectedOrganization()) {
      this.routingContextService.registerReturnTo()
      this.router.navigate(['/secure']).then()
      return false
    }
    return true
  }
}
