import {Component, inject} from '@angular/core'
import {FormField} from '@angular/forms/signals'
import {DatePicker} from 'primeng/datepicker'
import {Message} from 'primeng/message'
import {Select} from 'primeng/select'
import {ContactService} from '../../../api/organization-level/contact/contact.service'
import {FormFieldLayout} from '../../reusable/form-field/form-field-layout'
import {FormFieldComponent} from '../../reusable/form-field/form-field.component'
import {BulkPaymentFormContext} from './bulk-payment-form-context'

@Component({
  selector: 'rts-bulk-payment-filter',
  templateUrl: 'bulk-payment-filter.component.html',
  imports: [FormField, DatePicker, Message, Select, FormFieldComponent]
})
export class BulkPaymentFilterComponent {
  private readonly bulkPaymentFormContext = inject(BulkPaymentFormContext)
  private readonly contactService = inject(ContactService)

  readonly FormFieldDirection = FormFieldLayout
  readonly bulkPaymentForm = this.bulkPaymentFormContext.bulkPaymentForm
  readonly rangeTooWide = this.bulkPaymentFormContext.rangeTooWide
  readonly suppliers = this.contactService.suppliers
}
