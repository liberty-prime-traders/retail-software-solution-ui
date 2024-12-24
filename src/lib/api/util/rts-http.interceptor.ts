import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http'
import {inject, Injectable} from '@angular/core'
import {environment} from '@environments/environment'
import {mergeMap, Observable, throwError} from 'rxjs'
import {RtsOktaService} from '../../utils/services/rts-okta.service'

@Injectable()
export class RtsHttpInterceptor implements HttpInterceptor {
    private readonly rtsOktaService = inject(RtsOktaService)

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.rtsOktaService.accessToken$.pipe(
            mergeMap(accessToken => {
                if (!accessToken?.accessToken) {
                    console.error('No access token available')
                    return throwError(() => 'Access token missing')
                }
                req = req.clone({
                    url: `${environment.BASE_URL}${req.url}`,
                    setHeaders: {'Authorization': `Bearer ${accessToken.accessToken}`}
                })
                return next.handle(req)
            })
        )
    }
}
