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
  readonly labelColumnSize = input(2)
  readonly contentClass = input('col-5')
  readonly containerClass = input('')

  readonly formFieldDirection = FormFieldDirection

  readonly labelClass = computed(() => {
    const widthClass = this.layout() === FormFieldDirection.HORIZONTAL ? `col-${this.labelColumnSize()}` : ''
    const requiredClass = this.required() ? 'required-label' : ''
    return `${widthClass} ${requiredClass}`
  })

  readonly rightPadding = computed(() => {
    const matches = this.contentClass().match(/col-(\d+)/)
    if (matches && matches[1]) {
      const contentColumnSize = parseInt(matches[1])
      return Math.max(11 - contentColumnSize - this.labelColumnSize(), 0)
    }
    return 5
  })
}
