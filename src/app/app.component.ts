import {Component} from '@angular/core'
import {WelcomeComponent} from '../lib/components/welcome/welcome.component'
import {ToastModule} from 'primeng/toast'
import {MessageService} from 'primeng/api'

@Component({
  selector: 'rts-root',
  templateUrl: 'app.component.html',
  styleUrl: 'app.component.scss',
  imports: [
    ToastModule,
    WelcomeComponent
  ],
  providers: [
    MessageService
  ]
})
export class AppComponent {
  title = 'retail-software-solution-ui'
}
