import {inject, Injectable} from '@angular/core'
import {ActivatedRouteSnapshot, CanActivateChild, GuardResult, Router, RouterStateSnapshot} from '@angular/router'
import {Observable} from 'rxjs'
import {map} from 'rxjs/operators'
import {LibertyAccessService} from '../../lib/api/organization-level/liberty-access/liberty-access.service'
import {UserContextService} from '../../lib/utils/services/auth/user-context.service'

const ORGANIZATION_DASHBOARD_URL = '/secure/manage-organization'
const LOCATION_DASHBOARD_URL = '/secure/location-dashboard'

const ALLOWED_CHILD_PATHS_BY_DASHBOARD_URL: Record<string, string[]> = {
  [ORGANIZATION_DASHBOARD_URL]: ['summary'],
  [LOCATION_DASHBOARD_URL]: ['', 'products', 'sales']
}

@Injectable({providedIn: 'root'})
export class CanActivateChildForNonLibertyAdmin implements CanActivateChild {
  private readonly router = inject(Router)
  private readonly userContextService = inject(UserContextService)
  private readonly libertyAccessService = inject(LibertyAccessService)

  canActivateChild(_childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<GuardResult> {
    return this.libertyAccessService.ensureLoaded$().pipe(map(() => this.resolve(state)))
  }

  private resolve(state: RouterStateSnapshot): GuardResult {
    if (this.userContextService.isLibertyAdmin()) {
      return true
    }

    const requestedPath = state.url.split(/[?#]/)[0]
    for (const [dashboardUrl, allowedChildPaths] of Object.entries(ALLOWED_CHILD_PATHS_BY_DASHBOARD_URL)) {
      if (requestedPath.startsWith(dashboardUrl)) {
        const firstChildSegment = requestedPath.slice(dashboardUrl.length).split('/').filter(Boolean)[0] ?? ''
        return allowedChildPaths.includes(firstChildSegment) ? true : this.router.parseUrl(dashboardUrl)
      }
    }
    return true
  }
}
