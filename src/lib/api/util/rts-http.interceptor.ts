import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http'
import {inject, Injectable} from '@angular/core'
import {environment} from '@environments/environment'
import {Observable} from 'rxjs'
import {UserContextService} from '../../utils/services/auth/user-context.service'
import {SessionContextService} from '../../utils/services/session-context.service'

@Injectable()
export class RtsHttpInterceptor implements HttpInterceptor {
  private readonly userContextService = inject(UserContextService)
  private readonly sessionContextService = inject(SessionContextService)

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const resultingRequest = this.withBaseUrl(req)
    if (!req.url.startsWith('/secured')) {
      return next.handle(resultingRequest)
    }
    const sessionToken = this.userContextService.token()
    return next.handle(this.withAuthHeaders(resultingRequest, sessionToken))
  }

  private withAuthHeaders(req: HttpRequest<any>, token: string|null): HttpRequest<any> {
    const organization = this.sessionContextService.selectedOrganization()
    const location = this.sessionContextService.selectedLocation()

    return req.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`,
        'X-ORGANIZATION-ID': organization?.id?.toString() ?? '',
        'X-LOCATION-ID': location?.id?.toString() ?? ''
      }
    })
  }

  private withBaseUrl(req: HttpRequest<any>): HttpRequest<any> {
    if (req.url.includes('assets')) {
      return req
    }
    return req.clone({
      url: `${environment.BASE_URL}${req.url}`
    })
  }
}
