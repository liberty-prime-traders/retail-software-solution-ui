import {ChangeDetectionStrategy, Component, output} from '@angular/core'
import {ButtonDirective} from 'primeng/button'

@Component({
  selector: 'rts-new-form-cancel-button',
  imports: [
    ButtonDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host:has(> #new-form-cancel-button) {
      margin-right: 4rem;
      align-self: end;
    }
  `,
  template: `
    <button pButton
            (click)="onCancel.emit()"
            id="new-form-cancel-button"
            severity="info">
      <i class="pi pi-times"></i> Cancel
    </button>
  `
})
export class NewFormCancelButtonComponent {
  readonly onCancel = output<void>()
}
