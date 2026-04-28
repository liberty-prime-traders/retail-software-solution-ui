import {inject, Injectable} from '@angular/core'
import {CanActivate, Router} from '@angular/router'
import {NavigationScope} from '../../lib/components/welcome/top-navigation/navigation-scope.model'
import {SessionContextService} from '../../lib/utils/services/session-context.service'

@Injectable({providedIn: 'root'})
export class CanViewLocation implements CanActivate {
  private readonly router = inject(Router)
  private readonly sessionContextService = inject(SessionContextService)

  canActivate(): boolean {
    if (!this.sessionContextService.selectedLocation()) {
      this.router.navigate(['/manage-organization']).then()
      return false
    }
    this.sessionContextService.markAsSelectedScope(NavigationScope.LOCATION)
    return true
  }
}
