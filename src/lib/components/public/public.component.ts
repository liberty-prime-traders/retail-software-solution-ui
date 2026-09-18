import {AsyncPipe} from '@angular/common'
import {Component, inject} from '@angular/core'
import {Card} from 'primeng/card'
import {ScreenSizeService} from '../../utils/services/screen-size.service'

@Component({
  selector: 'rts-public',
  imports: [
    AsyncPipe,
    Card
  ],
  templateUrl: './public.component.html'
})
export class PublicComponent  {
  readonly screenSizeService = inject(ScreenSizeService)

}
