import {AsyncPipe} from '@angular/common'
import {Component, inject} from '@angular/core'
import {Card} from 'primeng/card'
import {ScreenSizeService} from '../../utils/services/screen-size.service'
import {ProcessingStatus} from '../../utils/types/processing-status.enum'
import {FormButtonsComponent} from '../reusable/form-buttons/form-buttons.component'

@Component({
  standalone: true,
  selector: 'rts-public',
  imports: [
    AsyncPipe,
    Card,
    FormButtonsComponent
  ],
  templateUrl: './public.component.html',
  styleUrl: './public.component.scss'
})
export class PublicComponent {
  readonly screenSizeService = inject(ScreenSizeService)
  readonly processingStatus = ProcessingStatus
}
