import {AsyncPipe} from '@angular/common'
import {Component, computed, inject} from '@angular/core'
import {Router, RouterLink, RouterOutlet} from '@angular/router'
import {Avatar} from 'primeng/avatar'
import {Button} from 'primeng/button'
import {Divider} from 'primeng/divider'
import {SysUserService} from '../../api/sys-user/sys-user.service'
import {RtsOktaService} from '../../utils/services/rts-okta.service'
import {SessionContextService} from '../../utils/services/session-context.service'

@Component({
  selector: 'rts-welcome',
  templateUrl: 'welcome.component.html',
  imports: [RouterOutlet, Divider, Button, RouterLink, AsyncPipe, Avatar]
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

  readonly isLoggedIn$ = this.rtsOktaService.loggedIn$

  logout() {
    this.router.navigateByUrl('/').then(() => this.rtsOktaService.signOut())
  }
  
  changeLocation() {
    this.sessionContextService.clearSelectedLocation()
    this.router.navigate(['/landing']).then()
  }
}
