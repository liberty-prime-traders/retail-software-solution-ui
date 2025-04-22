import {Component, computed, inject, input, OnInit} from '@angular/core'
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import {PaymentOption} from 'lib/api/payment-option/payment-option.model.'
import {PaymentOptionService} from 'lib/api/payment-option/payment-option.service'
import {FormButtonsComponent} from 'lib/components/reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from 'lib/components/reusable/form-field/form-field.component'
import {isNil} from 'lodash-es'
import {InputText} from 'primeng/inputtext'

@Component({
  selector: 'rts-payment-option-form',
  templateUrl: 'payment-option-form.component.html',
  imports: [
    ReactiveFormsModule,
    InputText,
    FormButtonsComponent,
    FormFieldComponent
  ]
})
export class PaymentOptionFormComponent implements OnInit {
  readonly paymentOption = input<PaymentOption>()

  private readonly paymentOptionService = inject(PaymentOptionService)
  private readonly formBuilder = inject(FormBuilder)

  readonly paymentOptionForm = computed(() => this.formBuilder.nonNullable.group({
    id: this.paymentOption()?.id,
    name: [this.paymentOption()?.name, Validators.required],
    description: this.paymentOption()?.description
  }))

  readonly processingStatus = this.paymentOptionService.selectProcessingStatus
  readonly failureMessages = this.paymentOptionService.selectFailureMessages

  ngOnInit() {
    this.paymentOptionService.resetProcessingStatus()
  }

  resetForm() {
    this.paymentOptionForm().reset(this.paymentOption())
  }

  upsertPaymentOption() {
    const updatedPaymentOption: Partial<PaymentOption> = this.paymentOptionForm().getRawValue()
    if (isNil(updatedPaymentOption.id)) {
      this.paymentOptionService.post(updatedPaymentOption)
    } else {
      this.paymentOptionService.put(updatedPaymentOption)
    }
  }

  deletePaymentOption() {
    this.paymentOptionService.delete(this.paymentOption()?.id)
  }
}
