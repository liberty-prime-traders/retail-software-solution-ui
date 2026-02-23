import {AsyncPipe, NgClass} from '@angular/common'
import {Component, computed, effect, inject, model, OnInit, signal, Signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {Router, RouterLink, RouterOutlet} from '@angular/router'
import {NgxResizeObserverModule} from 'ngx-resize-observer'
import {MenuItem} from 'primeng/api'
import {Avatar} from 'primeng/avatar'
import {Button} from 'primeng/button'
import {Divider} from 'primeng/divider'
import {Menubar} from 'primeng/menubar'
import {ToggleSwitch} from 'primeng/toggleswitch'
import {Tooltip} from 'primeng/tooltip'
import {darkModeSelector} from '../../../app/app.preset'
import {SysUserService} from '../../api/platform-level/sys-user/sys-user.service'
import {RtsOktaService} from '../../utils/services/rts-okta.service'
import {SessionContextService} from '../../utils/services/session-context.service'
import {AutoStretchService} from '../reusable/auto-stretch.service'

@Component({
  selector: 'rts-welcome',
  templateUrl: 'welcome.component.html',
  styleUrls: ['welcome.component.scss'],
  providers: [NgxResizeObserverModule],
  imports: [
    RouterOutlet,
    Divider,
    Button,
    RouterLink,
    AsyncPipe,
    Avatar,
    Menubar,
    NgClass,
    ToggleSwitch,
    FormsModule,
    Tooltip,
    NgxResizeObserverModule
  ]
})
export class WelcomeComponent implements OnInit {
  private readonly rtsOktaService = inject(RtsOktaService)
  private readonly router = inject(Router)
  readonly sessionContextService = inject(SessionContextService)
  private readonly userService = inject(SysUserService)
  private readonly autoStretchService = inject(AutoStretchService)

  private readonly loggedInUser = this.userService.selectFirst
  readonly darkMode = model(false)
  readonly fullScreen = signal(false)

  readonly userInitials = computed(() => {
    const user = this.loggedInUser()
    return user ? `${user?.firstName.charAt(0)}${user?.lastName.charAt(0)}` : ''
  })

  readonly quickActionsMenu: Signal<MenuItem[]> = computed(() => [
    {
      label: 'My Location',
      routerLink: '/secure/location-dashboard',
      visible: this.sessionContextService.locationIsSelected()
    },
    {
      label: this.sessionContextService.locationIsSelected() ? 'Switch Location' : 'Select Location',
      visible: this.sessionContextService.organizationIsSelected(),
      command: () => this.switchLocation()
    },
    {
      label: 'Switch Org',
      visible: this.sessionContextService.organizationIsSelected(),
      command: () => this.switchOrganization()
    },
    {
      label: 'Manage Org',
      visible: this.sessionContextService.loggedInUserIsOrganizationAdmin(),
      routerLink: '/secure/manage-organization'
    },
    {
      label: 'Manage Platform',
      visible: this.rtsOktaService.isPlatformAdmin() && this.sessionContextService.organizationIsSelected(),
      routerLink: '/secure/manage-platform'
    }
  ])

  readonly quickActionsMenuVisible = computed(() => this.quickActionsMenu().some(item => item.visible === true))

  readonly isLoggedIn$ = this.rtsOktaService.loggedIn$

  constructor() {
    effect(() => {
      if (this.darkMode()) {
        document.documentElement.classList.add(darkModeSelector)
      } else {
        document.documentElement.classList.remove(darkModeSelector)
      }
    })
  }

  ngOnInit() {
    this.onResize()
  }

  logout() {
    this.router.navigateByUrl('/').then(() => this.rtsOktaService.signOut())
  }

  setFullScreen(isFullScreen: boolean): void {
    this.fullScreen.set(isFullScreen)
    this.onResize()
  }

  protected onResize() {
    this.autoStretchService.triggerStretch()
  }

  private switchOrganization() {
    this.sessionContextService.clearSelectedOrganization()
    this.sessionContextService.clearSelectedLocation()
    this.router.navigate(['/secure']).then()
  }

  private switchLocation() {
    this.sessionContextService.clearSelectedLocation()
    this.router.navigate(['/secure/select-location']).then()
  }
}
