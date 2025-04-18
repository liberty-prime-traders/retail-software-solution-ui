import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http'
import {inject, Injectable} from '@angular/core'
import {environment} from '@environments/environment'
import {LocalStorageService} from 'lib/utils/services/local-storage.service'
import {LocalStorageKey} from 'lib/utils/types/local-storage-key.enum'
import {mergeMap, Observable, throwError} from 'rxjs'
import {RtsOktaService} from '../../utils/services/rts-okta.service'
import {Organization} from '../organization/organization.model'

@Injectable()
export class RtsHttpInterceptor implements HttpInterceptor {
  private readonly rtsOktaService = inject(RtsOktaService)
  private readonly localStorageService = inject(LocalStorageService)

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const organization = this.localStorageService.getItem<Organization>(LocalStorageKey.ORGANIZATION)

    return this.rtsOktaService.accessToken$.pipe(
      mergeMap(accessToken => {
        if (!accessToken?.accessToken) {
          console.error('No access token available')
          return throwError(() => 'Access token missing')
        }
        req = req.clone({
          url: `${environment.BASE_URL}${req.url}`,
          setHeaders: {
            'Authorization': `Bearer ${accessToken.accessToken}`,
            'X-ORGANIZATION-ID': organization?.id ?? ''
          }
        })
        return next.handle(req)
      })
    )
  }
}
