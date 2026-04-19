import {CurrencyPipe} from '@angular/common'
import {Component, computed, effect, inject, input, output, Signal, signal, untracked} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {form, FormField} from '@angular/forms/signals'
import {EntityId} from '@ngrx/signals/entities'
import {DatePicker} from 'primeng/datepicker'
import {InputNumber} from 'primeng/inputnumber'
import {InputText} from 'primeng/inputtext'
import {Select} from 'primeng/select'
import {PurchaseService} from '../../../../api/location-level/purchase/purchase.service'
import {SupplierPayment} from '../../../../api/location-level/supplier-payment/supplier-payment.model'
import {SupplierPaymentService} from '../../../../api/location-level/supplier-payment/supplier-payment.service'
import {PaymentOptionService} from '../../../../api/organization-level/payment-option/payment-option.service'
import {SelectItem, toSelectItems} from '../../../../utils/types/select-item.type'
import {BaseFormComponent} from '../../../reusable/base-form.component'
import {FormButtonsComponent} from '../../../reusable/form-buttons/form-buttons.component'
import {FormFieldDirection} from '../../../reusable/form-field/form-field-direction'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {LoadingContainerComponent} from '../../../reusable/loading-container/loading-container.component'
import {PaymentFormDefinition} from './payment-form.definition'

@Component({
  selector: 'rts-supplier-payment-form',
  templateUrl: 'payment-form.component.html',
  imports: [
    FormButtonsComponent,
    FormFieldComponent,
    DatePicker,
    FormField,
    InputNumber,
    InputText,
    Select,
    FormsModule,
    LoadingContainerComponent,
    CurrencyPipe
  ]
})
export class PaymentFormComponent extends BaseFormComponent<SupplierPaymentService> {
  readonly purchaseId = input.required<string>()
  readonly paymentSaved = output()
  readonly cancelled = output()

  private readonly supplierPaymentService = inject(SupplierPaymentService)
  private readonly purchaseService = inject(PurchaseService)
  private readonly paymentOptionService = inject(PaymentOptionService)
  protected readonly apiService = this.supplierPaymentService
  private readonly currencyPipe = inject(CurrencyPipe)

  readonly FormFieldDirection = FormFieldDirection
  readonly paymentFormFields = PaymentFormDefinition.fieldMap
  readonly paymentOptions = this.paymentOptionService.selectAll
  readonly isLoading = this.supplierPaymentService.selectLoading
  private readonly payments = this.supplierPaymentService.selectForGroup(this.purchaseId)
  private readonly purchase = computed(() => this.purchaseService.selectForId(this.purchaseId()))
  readonly remainingAmount = computed(() => (this.purchase()?.orderTotal ?? 0) - this.totalPaid())

  readonly deliveryOptions: Signal<SelectItem<EntityId>[]> = computed(() => {
    const deliveries = this.purchase()?.deliveries ?? []
    return toSelectItems(deliveries, {
      itemLabelBy: (delivery) =>
        `${delivery.referenceNumber} (${this.currencyPipe.transform(delivery.deliveryTotal)})`,
      itemValueBy: (delivery) => delivery.id
    })
  })

  private readonly totalPaid = computed(() =>
    this.payments()
      .filter(p => !p.voidedReason)
      .reduce((sum, p) => sum + p.amount, 0)
  )

  private readonly formValue = signal<PaymentFormDefinition.PaymentFormModel>(
    PaymentFormDefinition.defaultPaymentFormModel
  )

  private readonly patchPurchaseArrers = effect(() => {
    const purchaseArrears = this.remainingAmount()
    untracked(() =>
      this.formValue.update(current => ({...current, purchaseArrears}))
    )
  })

  readonly paymentForm = form(this.formValue, PaymentFormDefinition.paymentFormSchema)

  override ngOnInit() {
    super.ngOnInit()
    this.paymentOptionService.fetch()
  }

  cancel() {
    this.cancelled.emit()
  }

  save() {
    const dto = PaymentFormDefinition.convertToBackendModel(this.formValue(), this.purchaseId())
    this.supplierPaymentService.post(dto, {
      onSuccess: (payment) => {
        this.applyPurchasePaymentStatus(payment)
        this.paymentSaved.emit()
      }
    })
  }

  private applyPurchasePaymentStatus(payment: SupplierPayment) {
    if (!payment.updatedPurchasePaymentStatus) return
    if (this.purchase()) {
      this.purchaseService.applyResponse({
        ...this.purchase()!,
        paymentStatus: payment.updatedPurchasePaymentStatus
      })
    }
  }
}
