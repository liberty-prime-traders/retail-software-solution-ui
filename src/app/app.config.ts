import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core'
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async'
import {provideRouter} from '@angular/router'
import {OktaAuthModule} from '@okta/okta-angular'
import Aura from '@primeng/themes/aura'
import {appRoutes} from './app.routes'
import {oktaModuleConfig} from './rts-okta.config'
import { providePrimeNG } from 'primeng/config';


export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(OktaAuthModule.forRoot(oktaModuleConfig)),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: 'system'
        }
      }
    })
  ]
};
