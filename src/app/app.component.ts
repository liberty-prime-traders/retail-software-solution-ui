import {Component} from '@angular/core'
import {MessageService} from 'primeng/api'
import {ToastModule} from 'primeng/toast'
import {
  OrganizationLaunchService
} from '../lib/components/welcome/top-navigation/organization-nav-content/organization-launch.service'
import {SessionExpiredDialogComponent} from '../lib/components/auth/session-expired/session-expired-dialog.component'
import {WelcomeComponent} from '../lib/components/welcome/welcome.component'

@Component({
  selector: 'rts-root',
  templateUrl: 'app.component.html',
  styleUrl: 'app.component.scss',
  imports: [
    ToastModule,
    SessionExpiredDialogComponent,
    WelcomeComponent
  ],
  providers: [
    MessageService,
    OrganizationLaunchService
  ]
})
export class AppComponent {
  title = 'retail-software-solution-ui'
}
