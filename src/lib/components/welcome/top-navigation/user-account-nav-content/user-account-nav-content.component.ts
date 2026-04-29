import {Component, effect, inject, signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {Router} from '@angular/router'
import {Avatar} from 'primeng/avatar'
import {Button} from 'primeng/button'
import {Divider} from 'primeng/divider'
import {Popover} from 'primeng/popover'
import {Select} from 'primeng/select'
import {ToggleSwitch} from 'primeng/toggleswitch'
import {darkModeSelector} from '../../../../../app/app.preset'
import {DEFAULT_TIMEZONE, TIMEZONES} from '../../../../api/util/timezone.model'
import {LocalStorageService} from '../../../../utils/services/local-storage.service'
import {RtsOktaService} from '../../../../utils/services/rts-okta.service'
import {UserContextService} from '../../../../utils/services/user-context.service'
import {LocalStorageKey} from '../../../../utils/types/local-storage-key.enum'

@Component({
  selector: 'rts-user-account-nav-content',
  imports: [
    Avatar,
    Popover,
    Button,
    Divider,
    ToggleSwitch,
    FormsModule,
    Select
  ],
  templateUrl: 'user-account-nav-content.component.html'
})
export class UserAccountNavContentComponent {
  readonly userContextService = inject(UserContextService)
  private readonly rtsOktaService = inject(RtsOktaService)
  private readonly router = inject(Router)
  private readonly localStorageService = inject(LocalStorageService)

  readonly TIMEZONES = TIMEZONES
  
  readonly darkMode = signal(this.localStorageService.getItem<boolean>(LocalStorageKey.DARK_MODE) ?? false)

  readonly selectedTimeZone = signal(
    this.localStorageService.getItem<string>(LocalStorageKey.TIMEZONE) ?? DEFAULT_TIMEZONE.value
  )

  logout() {
    this.router.navigateByUrl('/').then(() => this.rtsOktaService.signOut())
  }

  private readonly updateDarkMode = effect(() => {
    if (this.darkMode()) {
      document.documentElement.classList.add(darkModeSelector)
    } else {
      document.documentElement.classList.remove(darkModeSelector)
    }
    this.localStorageService.setItem(LocalStorageKey.DARK_MODE, this.darkMode())
  })

  persistTimezoneChange() {
    this.localStorageService.setItem(LocalStorageKey.TIMEZONE, this.selectedTimeZone())
  }
}
