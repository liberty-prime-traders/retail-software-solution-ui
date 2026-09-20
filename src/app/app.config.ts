import {CurrencyPipe, DATE_PIPE_DEFAULT_OPTIONS, DatePipe} from '@angular/common'
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http'
import {ApplicationConfig, DEFAULT_CURRENCY_CODE, inject, provideZoneChangeDetection} from '@angular/core'
import {provideRouter} from '@angular/router'
import {environment} from '@environments/environment'
import {provideMarkdown} from 'ngx-markdown'
import {providePrimeNG} from 'primeng/config'
import {RtsHttpInterceptor} from '../lib/api/util/rts-http.interceptor'
import {ZonedDatesService} from '../lib/utils/services/zoned-dates.service'
import {AppPreset, darkModeSelector} from './app.preset'
import {appRoutes} from './app.routes'


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(appRoutes),
    provideMarkdown(),
    provideHttpClient(withInterceptorsFromDi()),
    providePrimeNG({
      license: environment.PRIME_LICENCE_KEY,
      theme: {
        preset: AppPreset,
        options: {
          darkModeSelector: `.${darkModeSelector}`
        }
      }
    }),
    {provide: HTTP_INTERCEPTORS, useClass: RtsHttpInterceptor, multi: true},
    {provide: CurrencyPipe},
    {provide: DatePipe},
    {
      provide: DATE_PIPE_DEFAULT_OPTIONS,
      useFactory: () => {
        const zonedDatesService = inject(ZonedDatesService)
        const timezone = zonedDatesService.getOffsetFromDate(new Date())
        return {timezone, dateFormat: 'medium'}
      }
    },
    {provide: DEFAULT_CURRENCY_CODE, useValue: 'KES '}
  ]
}
