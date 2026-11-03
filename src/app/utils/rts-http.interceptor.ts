import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http'
import {inject, Injectable} from '@angular/core'
import {environment} from '@environments/environment'
import {Observable, throwError} from 'rxjs'
import {catchError, tap} from 'rxjs/operators'
import {NavigationScope} from '../../lib/components/welcome/top-navigation/navigation-scope.model'
import {AuthenticationService} from '../../lib/api/platform-level/authentication/authentication.service'
import {UserContextService} from '../../lib/utils/services/auth/user-context.service'
import {SessionReauthenticationService} from '../../lib/utils/services/auth/session-reauthentication.service'
import {SessionContextService} from '../../lib/utils/services/session-context.service'

const RENEWED_TOKEN_HEADER = 'X-Renewed-Token'

@Injectable()
export class RtsHttpInterceptor implements HttpInterceptor {
  private readonly userContextService = inject(UserContextService)
  private readonly sessionContextService = inject(SessionContextService)
  private readonly authenticationService = inject(AuthenticationService)
  private readonly sessionReauthenticationService = inject(SessionReauthenticationService)

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const resultingRequest = this.withBaseUrl(req)
    if (!req.url.startsWith('/secured')) {
      return next.handle(resultingRequest)
    }
    const sessionToken = this.userContextService.token()
    return this.send(next, resultingRequest, sessionToken).pipe(
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.retryAfterSignIn(next, resultingRequest, sessionToken, error)
        }
        return throwError(() => error)
      })
    )
  }

  private send(next: HttpHandler, request: HttpRequest<any>, sessionToken: string | null): Observable<HttpEvent<any>> {
    return next.handle(this.withAuthHeaders(request, sessionToken)).pipe(
      tap((event) => this.renewSessionTokenFrom(event))
    )
  }

  private retryAfterSignIn(
    next: HttpHandler,
    request: HttpRequest<any>,
    sentToken: string | null,
    unauthorizedError: HttpErrorResponse
  ): Observable<HttpEvent<any>> {
    const currentToken = this.userContextService.token()
    if (currentToken && currentToken !== sentToken) {
      return this.send(next, request, currentToken)
    }
    return this.sessionReauthenticationService.requestSignIn(
      () => this.send(next, request, this.userContextService.token()),
      unauthorizedError
    )
  }

  private renewSessionTokenFrom(event: HttpEvent<unknown>): void {
    if (!(event instanceof HttpResponse)) {
      return
    }
    const renewedToken = event.headers.get(RENEWED_TOKEN_HEADER)
    if (renewedToken) {
      this.authenticationService.renewSessionToken(renewedToken)
    }
  }

  private withAuthHeaders(req: HttpRequest<any>, token: string|null): HttpRequest<any> {
    const organization = this.sessionContextService.selectedOrganization()
    let location = null
    if (this.sessionContextService.selectedScope() === NavigationScope.LOCATION) {
      location = this.sessionContextService.selectedLocation()
    }

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
