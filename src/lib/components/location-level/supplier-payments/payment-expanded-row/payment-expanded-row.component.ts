import {NgTemplateOutlet} from '@angular/common'
import {Component, computed, inject, input, output, signal} from '@angular/core'
import {form, FormField, required} from '@angular/forms/signals'
import {Button} from 'primeng/button'
import {InputText} from 'primeng/inputtext'
import {Tab, TabList, TabPanel, TabPanels, Tabs} from 'primeng/tabs'
import {PurchaseService} from '../../../../api/location-level/purchase/purchase.service'
import {
  SupplierPayment,
  SupplierPaymentVoidRequest
} from '../../../../api/location-level/supplier-payment/supplier-payment.model'
import {SupplierPaymentService} from '../../../../api/location-level/supplier-payment/supplier-payment.service'
import {BaseFormComponent} from '../../../reusable/base-form.component'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldLayout} from '../../../reusable/form-field/form-field-layout'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {KafkaEventLogComponent} from '../../kafka-event-log/kafka-event-log.component'

@Component({
  selector: 'rts-supplier-payment-expanded-row',
  templateUrl: 'payment-expanded-row.component.html',
  imports: [
    Button,
    FormButtonsComponent,
    FormFieldComponent,
    FormField,
    InputText,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    NgTemplateOutlet,
    KafkaEventLogComponent
  ]
})
export class PaymentExpandedRowComponent extends BaseFormComponent<SupplierPaymentService> {
  readonly payment = input.required<SupplierPayment>()
  readonly purchaseId = input.required<string>()
  readonly paymentVoided = output()

  private readonly supplierPaymentService = inject(SupplierPaymentService)
  private readonly purchaseService = inject(PurchaseService)
  protected readonly apiService = this.supplierPaymentService

  readonly FormFieldDirection = FormFieldLayout
  readonly isVoided = computed(() => !!this.payment().voidedReason)
  readonly voidIsActive = signal(false)

  private readonly voidFormValue = signal({reason: ''})

  readonly voidForm = form(this.voidFormValue, s => {
    required(s.reason)
  })

  confirmVoid() {
    const voidRequest: SupplierPaymentVoidRequest = {
      supplierPaymentId: String(this.payment().id),
      reason: this.voidFormValue().reason
    }
    this.supplierPaymentService.voidPayment(voidRequest, {
      onSuccess: (response) => this.patchPayment(response)
    })
  }

  private patchPayment(payment: SupplierPayment) {
    if (payment.updatedPurchasePaymentStatus) {
      const current = this.purchaseService.selectForId(this.purchaseId())
      if (current) {
        this.purchaseService.applyResponse({...current, paymentStatus: payment.updatedPurchasePaymentStatus})
      }
    }
    this.voidIsActive.set(false)
    this.paymentVoided.emit()
  }
}
