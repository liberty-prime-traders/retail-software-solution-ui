import {Component, computed, input} from '@angular/core'
import {ValidationError} from '@angular/forms/signals'
import {toErrorMessages} from '../../../utils/form-validation'

@Component({
  selector: 'rts-error-summary',
  styles: `
    ul {
      padding-inline-start: 20px;
    }
  `,
  template: `
    @if (errorMessages().length > 0) {
      <ul>
        @for(message of errorMessages(); track message) {
          <li class="error-message pl-0">{{ message }}</li>
        }
      </ul>
    }
  `,
  imports: []
})
export class ErrorSummaryComponent<T> {
  readonly signalFormErrors = input<ValidationError.WithField[]>()
  readonly fieldMap = input<Map<keyof T, string>>()
  readonly regularErrorMessages = input<string[] | undefined>([])

  readonly errorMessages = computed(() => {
    if (this.fieldMap()) {
      return toErrorMessages(this.fieldMap()!, this.signalFormErrors())
    }
    return this.regularErrorMessages() ?? []
  })

}
