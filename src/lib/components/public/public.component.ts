import {AsyncPipe} from '@angular/common'
import {Component, inject} from '@angular/core'
import {Card} from 'primeng/card'
import {ScreenSizeService} from '../../utils/services/screen-size.service'
import {GoogleAuthComponent} from '../auth/google/google-auth.component'

@Component({
  selector: 'rts-public',
  imports: [
    AsyncPipe,
    Card,
    GoogleAuthComponent
  ],
  templateUrl: './public.component.html'
})
export class PublicComponent  {
  readonly screenSizeService = inject(ScreenSizeService)

}
