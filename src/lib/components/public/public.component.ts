import {AsyncPipe} from '@angular/common'
import {Component, inject} from '@angular/core'
import {ScreenSizeService} from '../../utils/services/screen-size.service'

@Component({
  standalone: true,
  selector: 'app-public',
  imports: [
    AsyncPipe
  ],
  templateUrl: './public.component.html',
  styleUrl: './public.component.scss'
})
export class PublicComponent {
  readonly screenSizeService = inject(ScreenSizeService)
}
