import {inject, Injectable} from '@angular/core'
import {CanActivate, Router} from '@angular/router'
import {RtsOktaService} from '../../lib/utils/services/rts-okta.service'

@Injectable({providedIn: 'root'})
export class CanViewPlatformOrganization implements CanActivate {
  private readonly oktaService = inject(RtsOktaService)
  private readonly router = inject(Router)

  canActivate(): boolean {
    if (!this.oktaService.isPlatformAdmin()) {
      this.router.createUrlTree(['/secure'])
      return false
    }
    return true
  }
}
