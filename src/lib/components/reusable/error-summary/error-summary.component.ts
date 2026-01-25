import {Component, computed, input} from '@angular/core'
import {ValidationError} from '@angular/forms/signals'
import {toErrorMessages} from '../../../utils/form-validation'

@Component({
  selector: 'rts-error-summary',
  template: `
    @if (errorMessages().length > 0) {
      @for(message of errorMessages(); track message) {
        <div class="error-message">{{ message }}</div>
      }
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
