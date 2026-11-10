import {CurrencyPipe, NgTemplateOutlet} from '@angular/common'
import {Component, inject} from '@angular/core'
import {FormField} from '@angular/forms/signals'
import {ButtonDirective} from 'primeng/button'
import {DatePicker} from 'primeng/datepicker'
import {InputNumber} from 'primeng/inputnumber'
import {Message} from 'primeng/message'
import {Select} from 'primeng/select'
import {Textarea} from 'primeng/textarea'
import {
  PurchaseBulkPaymentService
} from '../../../api/location-level/purchase-bulk-payment/purchase-bulk-payment.service'
import {PaymentOptionService} from '../../../api/organization-level/payment-option/payment-option.service'
import {NullishToZeroPipe} from '../../../utils/pipes/nullish-to-zero.pipe'
import {BaseFormComponent} from '../../reusable/base-form.component'
import {ErrorSummaryComponent} from '../../reusable/error-summary/error-summary.component'
import {FormFieldLayout} from '../../reusable/form-field/form-field-layout'
import {FormFieldComponent} from '../../reusable/form-field/form-field.component'
import {BulkPaymentFormContext} from './bulk-payment-form-context'
import {BulkPaymentFormDefinition} from './bulk-payment-form.definition'

@Component({
  selector: 'rts-bulk-payment-payment-form',
  templateUrl: 'bulk-payment-payment-form.component.html',
  imports: [
    FormField,
    ButtonDirective,
    DatePicker,
    InputNumber,
    Message,
    Select,
    FormFieldComponent,
    ErrorSummaryComponent,
    CurrencyPipe,
    NullishToZeroPipe,
    NgTemplateOutlet,
    Textarea
  ]
})
export class BulkPaymentPaymentFormComponent extends BaseFormComponent<PurchaseBulkPaymentService> {
  private readonly bulkPaymentFormContext = inject(BulkPaymentFormContext)
  private readonly paymentOptionService = inject(PaymentOptionService)
  protected readonly apiService = inject(PurchaseBulkPaymentService)

  readonly FormFieldDirection = FormFieldLayout
  readonly bulkPaymentFormFields = BulkPaymentFormDefinition.fieldMap
  readonly bulkPaymentForm = this.bulkPaymentFormContext.bulkPaymentForm
  readonly paymentOptions = this.paymentOptionService.selectAll
  readonly paymentRecorded = this.bulkPaymentFormContext.paymentRecorded
  readonly amountExceedsSelectedPayable = this.bulkPaymentFormContext.amountExceedsSelectedPayable
  readonly disableSave = this.bulkPaymentFormContext.disableSave

  save() {
    this.apiService.recordPayment(this.bulkPaymentFormContext.getCreateRequest(), {
      onSuccess: () => this.bulkPaymentFormContext.markPaymentRecorded()
    })
  }

  startNewPayment() {
    this.bulkPaymentFormContext.startNewPayment()
  }
}
