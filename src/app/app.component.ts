import {Component} from '@angular/core'
import {WelcomeComponent} from '../lib/components/welcome/welcome.component'

@Component({
  standalone: true,
  selector: 'rts-root',
  templateUrl: 'app.component.html',
  styleUrl: 'app.component.scss',
  imports: [
    WelcomeComponent
  ]
})
export class AppComponent {
  title = 'retail-software-solution-ui';
}
