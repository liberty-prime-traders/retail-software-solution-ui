import {NgClass} from '@angular/common'
import {Component, input} from '@angular/core'
import {FormFieldDirection} from './form-field-direction'

@Component({
  selector: 'rts-form-field',
  templateUrl: './form-field.component.html',
  standalone: true,
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
  readonly contentClass = input('')
  readonly containerClass = input('pl-4')

  readonly formFieldDirection = FormFieldDirection
}
