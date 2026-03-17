import {ChangeDetectionStrategy, Component, output} from '@angular/core'
import {Button} from 'primeng/button'

@Component({
  selector: 'rts-new-form-cancel-button',
  imports: [
    Button
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host:has(> #new-form-cancel-button) {
      margin-right: 4rem;
      align-self: end;
    }
  `,
  template: `
    <p-button (click)="onCancel.emit()"
              id="new-form-cancel-button"
              label="Cancel"
              icon="pi pi-times"
              severity="info">
    </p-button>
  `
})
export class NewFormCancelButtonComponent {
  readonly onCancel = output<void>()
}
