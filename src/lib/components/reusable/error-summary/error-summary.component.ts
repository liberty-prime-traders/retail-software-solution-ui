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
  errors = input<ValidationError.WithField[]>()
  fieldMap = input.required<Map<keyof T, string>>()

  errorMessages = computed(() =>
    toErrorMessages(this.fieldMap(), this.errors())
  )

}
