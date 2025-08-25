import {NgClass} from '@angular/common'
import {Component, computed, input} from '@angular/core'
import {FormFieldDirection} from './form-field-direction'

@Component({
  selector: 'rts-form-field',
  templateUrl: './form-field.component.html',
  imports: [
    NgClass
  ],
  styleUrls: ['./form-field.component.scss']
})

export class FormFieldComponent {
  readonly label = input('')
  readonly for = input('')
  readonly layout = input(FormFieldDirection.HORIZONTAL)
  readonly required = input(false)
  readonly labelWidth = input('120px')
  readonly contentClass = input('col-5')
  readonly containerClass = input('')

  readonly formFieldDirection = FormFieldDirection

  readonly rightPadding = computed(() => {
    const contentClass = this.contentClass()
    const matches = contentClass.match(/col-(\d+)/)
    if (matches && matches[1]) {
      const colSpan = parseInt(matches[1])
      return Math.max(12 - colSpan - 2, 0)
    }
    return 5
  })
}
