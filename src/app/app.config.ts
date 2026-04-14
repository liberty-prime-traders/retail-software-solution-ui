import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http'
import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection
} from '@angular/core'
import {provideRouter} from '@angular/router'
import {OktaAuthModule} from '@okta/okta-angular'
import {provideMarkdown} from 'ngx-markdown'
import {RtsHttpInterceptor} from '../lib/api/util/rts-http.interceptor'
import {AppPreset, darkModeSelector} from './app.preset'
import {appRoutes} from './app.routes'
import {oktaModuleConfig} from './rts-okta.config'
import {providePrimeNG} from 'primeng/config'


export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(OktaAuthModule.forRoot(oktaModuleConfig)),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(appRoutes),
    provideMarkdown(),
    provideHttpClient(withInterceptorsFromDi()),
    providePrimeNG({
      theme: {
        preset: AppPreset,
        options: {
          darkModeSelector: `.${darkModeSelector}`
        }
      }
    }),
    {provide: HTTP_INTERCEPTORS, useClass: RtsHttpInterceptor, multi: true}
  ]
}
