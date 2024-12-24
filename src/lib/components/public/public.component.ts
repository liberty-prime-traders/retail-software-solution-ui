import {AsyncPipe} from '@angular/common'
import {Component, inject} from '@angular/core'
import {Card} from 'primeng/card'
import {ScreenSizeService} from '../../utils/services/screen-size.service'

@Component({
    standalone: true,
    selector: 'rts-public',
    imports: [
        AsyncPipe,
        Card
    ],
    templateUrl: './public.component.html',
    styleUrl: './public.component.scss'
})
export class PublicComponent {
    readonly screenSizeService = inject(ScreenSizeService)
}
