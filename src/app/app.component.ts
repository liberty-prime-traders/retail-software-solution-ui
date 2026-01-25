import {Component} from '@angular/core'
import {MessageService} from 'primeng/api'
import {ToastModule} from 'primeng/toast'
import {WelcomeComponent} from '../lib/components/welcome/welcome.component'

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
