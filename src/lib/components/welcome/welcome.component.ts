import {Component, inject} from '@angular/core'
import {Router, RouterLink, RouterOutlet} from '@angular/router'
import {Button} from 'primeng/button'
import {Divider} from 'primeng/divider'
import {RtsOktaService} from '../../utils/services/rts-okta.service'

@Component({
  standalone: true,
  selector: 'rts-welcome',
  templateUrl: 'welcome.component.html',
  imports: [RouterOutlet, Divider, Button, RouterLink]
})
export class WelcomeComponent {
  private readonly rtsOktaService = inject(RtsOktaService)
  private readonly router = inject(Router)

  logout() {
    this.router.navigateByUrl('/').then(() => this.rtsOktaService.signOut())
  }
}
