import {inject, Injectable} from '@angular/core'
import {CanActivate, Router} from '@angular/router'
import {NavigationScope} from '../../lib/components/welcome/top-navigation/navigation-scope.model'
import {SessionContextService} from '../../lib/utils/services/session-context.service'

@Injectable({providedIn: 'root'})
export class CanViewOrganization implements CanActivate {
  private readonly router = inject(Router)
  private readonly sessionContextService = inject(SessionContextService)

  canActivate(): boolean {
    if (!this.sessionContextService.selectedOrganization()) {
      this.router.navigate(['/secure']).then()
      return false
    }
    this.sessionContextService.markAsSelectedScope(NavigationScope.ORG)
    return true
  }
}
