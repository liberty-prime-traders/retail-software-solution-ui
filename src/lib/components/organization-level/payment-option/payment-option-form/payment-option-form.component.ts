import {Component, effect, inject, input, OnInit, signal, untracked} from '@angular/core'
import {FormField, form} from '@angular/forms/signals'
import {PaymentOption} from '../../../../api/organization-level/payment-option/payment-option.model.'
import {PaymentOptionService} from '../../../../api/organization-level/payment-option/payment-option.service'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {isNil} from 'lodash-es'
import {InputText} from 'primeng/inputtext'
import {PaymentOptionFormDefinition} from './payment-option-form.definition'

@Component({
  standalone: true,
  selector: 'rts-payment-option-form',
  templateUrl: './payment-option-form.component.html',
  imports: [
    InputText,
    FormButtonsComponent,
    FormFieldComponent,
    FormField
  ]
})
export class PaymentOptionFormComponent implements OnInit {
  readonly paymentOption = input<PaymentOption>()

  private readonly paymentOptionService = inject(PaymentOptionService)

  readonly paymentOptionFormModel = signal<PaymentOptionFormDefinition.PaymentOptionFormModel>(
    PaymentOptionFormDefinition.defaultPaymentOptionFormModel
  )
  readonly paymentOptionForm = form(
    this.paymentOptionFormModel,
    PaymentOptionFormDefinition.paymentOptionFormSchema
  )
  readonly paymentOptionFieldMap = PaymentOptionFormDefinition.fieldMap

  readonly processingStatus = this.paymentOptionService.selectProcessingStatus
  readonly failureMessages = this.paymentOptionService.selectFailureMessages

  constructor() {
    effect(() => {
      const current = this.paymentOption()
      untracked(() => {
        this.paymentOptionFormModel.set(
          PaymentOptionFormDefinition.convertToFormModel(current)
        )
      })
    })
  }

  ngOnInit() {
    this.paymentOptionService.resetProcessingStatus()
  }

  resetForm() {
    this.paymentOptionFormModel.set(
      PaymentOptionFormDefinition.convertToFormModel(this.paymentOption())
    )
  }

  upsertPaymentOption() {
    const updatedPaymentOption = PaymentOptionFormDefinition.convertToBackendModel(
      this.paymentOptionFormModel()
    )
    if (isNil(updatedPaymentOption.id) || updatedPaymentOption.id === '') {
      this.paymentOptionService.post(updatedPaymentOption)
    } else {
      this.paymentOptionService.put(updatedPaymentOption)
    }
  }

  deletePaymentOption() {
    this.paymentOptionService.delete(this.paymentOption()?.id)
  }
}
