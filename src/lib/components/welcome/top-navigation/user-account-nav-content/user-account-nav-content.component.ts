import {Component, effect, inject} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {Router} from '@angular/router'
import {Avatar} from 'primeng/avatar'
import {Button} from 'primeng/button'
import {Divider} from 'primeng/divider'
import {Popover} from 'primeng/popover'
import {Select} from 'primeng/select'
import {ToggleSwitch} from 'primeng/toggleswitch'
import {darkModeSelector} from '../../../../../app/app.preset'
import {TIMEZONES} from '../../../../api/util/timezone.model'
import {RtsOktaService} from '../../../../utils/services/rts-okta.service'
import {UserContextService} from '../../../../utils/services/user-context.service'

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

  readonly darkMode = this.userContextService.darkMode
  readonly selectedTimeZone = this.userContextService.selectedTimezone
  readonly TIMEZONES = TIMEZONES

  logout() {
    this.router.navigateByUrl('/').then(() => this.rtsOktaService.signOut())
  }

  constructor() {
    effect(() => {
      if (this.darkMode()) {
        document.documentElement.classList.add(darkModeSelector)
      } else {
        document.documentElement.classList.remove(darkModeSelector)
      }
    })
  }
}
