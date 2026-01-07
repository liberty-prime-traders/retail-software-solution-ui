import {Component, computed, input} from '@angular/core'
import {ValidationError} from '@angular/forms/signals'
import {toErrorMessages} from '../../../utils/form-validation'

@Component({
  selector: 'rts-error-summary',
  templateUrl: 'error-summary.component.html',
  imports: []
})
export class ErrorSummaryComponent<T> {
  errors = input<ValidationError.WithField[]>()
  fieldMap = input.required<Map<keyof T, string>>()

  errorMessages = computed(() =>
    toErrorMessages(this.fieldMap(), this.errors())
  )

}
