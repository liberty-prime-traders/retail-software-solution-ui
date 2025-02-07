import {Component, Input} from '@angular/core'
import {NgClass} from '@angular/common'

@Component({
  selector: 'rts-form-field',
  templateUrl: './form-field.component.html',
  standalone: true,
  imports: [
    NgClass
  ],
  styleUrls: ['./form-field.component.css']
})

export class FormFieldComponent {
  @Input() label: string = ''
  @Input() for: string = ''
  @Input() layout: 'horizontal' | 'vertical' = 'horizontal'
  @Input() required: boolean = false
  @Input() labelWidth: string = '120px'
}
