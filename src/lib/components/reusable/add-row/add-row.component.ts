import {Component, model} from '@angular/core'
import {Button} from 'primeng/button'

@Component({
  selector: 'rts-add-row',
  templateUrl: 'add-row.component.html',
  imports: [
    Button
  ]
})
export class AddRowComponent {
  readonly addingIsActive = model(false)
  readonly disabled = model<boolean|null>(false)
}
