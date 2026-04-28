import {inject, Injectable} from '@angular/core'
import {CanActivate, Router} from '@angular/router'
import {NavigationScope} from '../../lib/components/welcome/top-navigation/navigation-scope.model'
import {SessionContextService} from '../../lib/utils/services/session-context.service'
import {UserContextService} from '../../lib/utils/services/user-context.service'

@Injectable({providedIn: 'root'})
export class CanViewPlatformOrganization implements CanActivate {
  private readonly userContextService = inject(UserContextService)
  private readonly sessionContextService = inject(SessionContextService)
  private readonly router = inject(Router)

  canActivate(): boolean {
    if (!this.userContextService.isPlatformAdmin()) {
      this.router.createUrlTree(['/secure'])
      return false
    }
    this.sessionContextService.markAsSelectedScope(NavigationScope.PLATFORM)
    return true
  }
}
