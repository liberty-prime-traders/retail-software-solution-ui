import {NgClass} from '@angular/common'
import {Component, computed, input} from '@angular/core'
import {FormFieldLayout} from './form-field-layout'

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
  readonly layout = input(FormFieldLayout.HORIZONTAL)
  readonly required = input(false)
  readonly labelColumnSize = input(2)
  readonly contentClass = input('col-5')
  readonly containerClass = input('')
  readonly labelClass = input('')

  readonly effectiveContentClass = computed(() => {
    const compactClass = this.layout() === FormFieldLayout.COMPACT ? 'compact-form-field' : ''
    return `${this.contentClass()} ${compactClass}`
  })

  readonly effectiveLabelClass = computed(() => {
    const widthClass = this.layout() === FormFieldLayout.HORIZONTAL ? `col-${this.labelColumnSize()}` : ''
    const requiredClass = this.required() ? 'required-label' : ''
    const marginClass = this.layout() === FormFieldLayout.COMPACT ? 'm-0' : ''
    const boldClass = this.layout() !== FormFieldLayout.COMPACT ? 'font-semibold' : ''
    return `${this.labelClass()} ${widthClass} ${requiredClass} ${marginClass} ${boldClass}`
  })

  readonly rightPadding = computed(() => {
    if (this.layout() !== FormFieldLayout.HORIZONTAL) {
      return 0
    }
    const matches = this.contentClass().match(/col-(\d+)/)
    if (matches && matches[1]) {
      const contentColumnSize = parseInt(matches[1])
      return Math.max(11 - contentColumnSize - this.labelColumnSize(), 0)
    }
    return 5
  })

  readonly effectiveLayoutClass = computed(() => {
    switch (this.layout()) {
      case FormFieldLayout.COMPACT: return 'flex-column'
      case FormFieldLayout.VERTICAL: return 'field flex-column gap-1 pl-4'
      case FormFieldLayout.HORIZONTAL:
      default:
        return 'field gap-2 align-items-center pl-4'
    }
  })
  protected readonly FormFieldDirection = FormFieldLayout
}
