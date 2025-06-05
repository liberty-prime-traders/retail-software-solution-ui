import {Component, model} from '@angular/core'
import {TableModule} from 'primeng/table'
import {NgIf} from '@angular/common'

@Component({
  selector: 'rts-block-ui',
  templateUrl: 'block-ui.component.html',
  imports: [
    TableModule,
    NgIf
  ]
})
export class BlockUiComponent {
  readonly blocked = model<boolean|null>(false)
}
