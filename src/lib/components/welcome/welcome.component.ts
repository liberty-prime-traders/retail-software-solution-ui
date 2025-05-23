import {AsyncPipe, NgClass} from '@angular/common'
import {Component, computed, inject, Signal} from '@angular/core'
import {Router, RouterLink, RouterOutlet} from '@angular/router'
import {MenuItem} from 'primeng/api'
import {Avatar} from 'primeng/avatar'
import {Button} from 'primeng/button'
import {Divider} from 'primeng/divider'
import {Menubar} from 'primeng/menubar'
import {SysUserService} from '../../api/sys-user/sys-user.service'
import {RtsOktaService} from '../../utils/services/rts-okta.service'
import {SessionContextService} from '../../utils/services/session-context.service'

@Component({
  selector: 'rts-welcome',
  templateUrl: 'welcome.component.html',
  styleUrls: ['welcome.component.scss'],
  imports: [RouterOutlet, Divider, Button, RouterLink, AsyncPipe, Avatar, Menubar, NgClass]
})
export class WelcomeComponent {
  private readonly rtsOktaService = inject(RtsOktaService)
  private readonly router = inject(Router)
  readonly sessionContextService = inject(SessionContextService)
  private readonly userService = inject(SysUserService)

  private readonly loggedInUser = this.userService.selectFirst

  readonly userInitials = computed(() => {
    const user = this.loggedInUser()
    return user ? `${user?.firstName.charAt(0)}${user?.lastName.charAt(0)}` : ''
  })

  readonly quickActionsMenu: Signal<MenuItem[]> = computed(() => [
    {
      label: 'Location Summary',
      icon: 'pi pi-home',
      routerLink: '/secure/location-dashboard',
      visible: this.sessionContextService.locationIsSelected()
    },
    {
      label: 'Switch Organization',
      icon: 'pi pi-sitemap',
      visible: this.sessionContextService.organizationIsSelected(),
      command: () => this.switchOrganization()
    },
    {
      label: 'Manage Organization',
      icon: 'pi pi-building',
      visible: this.sessionContextService.loggedInUserIsOrganizationAdmin(),
      routerLink: '/secure/manage-organization'
    },
    {
      label: this.sessionContextService.locationIsSelected() ? 'Switch Location' : 'Select Location',
      icon: 'pi pi-map-marker',
      visible: this.sessionContextService.organizationIsSelected(),
      command: () => this.switchLocation()
    }
  ])

  readonly quickActionsMenuVisible = computed(() => this.quickActionsMenu().some(item => item.visible === true))

  readonly isLoggedIn$ = this.rtsOktaService.loggedIn$

  logout() {
    this.router.navigateByUrl('/').then(() => this.rtsOktaService.signOut())
  }

  private switchOrganization() {
    this.sessionContextService.clearSelectedOrganization()
    this.router.navigate(['/secure']).then()
  }

  private switchLocation() {
    this.sessionContextService.clearSelectedLocation()
    this.router.navigate(['/secure/select-location']).then()
  }
}
