import {CurrencyPipe} from '@angular/common'
import {Component, computed, inject, OnInit, output, signal, Signal} from '@angular/core'
import {apply, form, FormField} from '@angular/forms/signals'
import {EntityId} from '@ngrx/signals/entities'
import {MenuItem} from 'primeng/api'
import {Button} from 'primeng/button'
import {DatePicker} from 'primeng/datepicker'
import {InputNumber} from 'primeng/inputnumber'
import {InputText} from 'primeng/inputtext'
import {Menu} from 'primeng/menu'
import {SelectButton} from 'primeng/selectbutton'
import {SalePayment, SalePaymentCreateRequest} from '../../../../api/location-level/sale-payment/sale-payment.model'
import {SalePaymentService} from '../../../../api/location-level/sale-payment/sale-payment.service'
import {SaleStatus} from '../../../../api/location-level/sale/sale-status.enum'
import {PaymentOption} from '../../../../api/organization-level/payment-option/payment-option.model.'
import {PaymentOptionService} from '../../../../api/organization-level/payment-option/payment-option.service'
import {SequentialIdGenerator} from '../../../../utils/services/sequential-id-generator'
import {ZonedDatesService} from '../../../../utils/services/zoned-dates.service'
import {ErrorSummaryComponent} from '../../../reusable/error-summary/error-summary.component'
import {FormFieldLayout} from '../../../reusable/form-field/form-field-layout'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {LoadingContainerComponent} from '../../../reusable/loading-container/loading-container.component'
import {SaleFormContext} from '../form-utils/sale-form-context'
import {SalePaymentFormDefinition} from '../form-utils/sale-payment-form-definition'

@Component({
  selector: 'rts-sale-payment-form',
  templateUrl: 'sale-payment-form.component.html',
  imports: [
    LoadingContainerComponent,
    SelectButton,
    Menu,
    Button,
    FormFieldComponent,
    InputNumber,
    InputText,
    DatePicker,
    FormField,
    CurrencyPipe,
    ErrorSummaryComponent
  ]
})
export class SalePaymentFormComponent implements OnInit {
  private readonly paymentOptionService = inject(PaymentOptionService)
  private readonly sequentialIdGenerator = inject(SequentialIdGenerator)
  private readonly context = inject(SaleFormContext)
  private readonly salePaymentService = inject(SalePaymentService)
  private readonly zonedDatesService = inject(ZonedDatesService)

  readonly paymentReturnedFromBackend = output<Partial<SalePayment>>()
  readonly FormFieldDirection = FormFieldLayout
  private readonly otherPaymentOption: Partial<PaymentOption> = {id: 'other', name: 'Other'}
  private readonly preselectedOverride = signal<Partial<PaymentOption>[]>([])
  readonly paymentOptions: Signal<Partial<PaymentOption>[]> = this.paymentOptionService.selectAll

  readonly paymentsFailureMessages = this.salePaymentService.selectFailureMessages
  readonly originalSale = this.context.originalSale
  private readonly paymentFormValue = signal(SalePaymentFormDefinition.createInitial)
  private readonly paymentOptionsLoading = this.paymentOptionService.selectLoading
  private readonly paymentsLoading = this.salePaymentService.selectLoading
  readonly dependenciesLoading = computed(() => this.paymentOptionsLoading() || this.paymentsLoading())

  readonly paymentForm = form(this.paymentFormValue, s => {
    apply(s, SalePaymentFormDefinition.salePaymentFormSchema)
  })

  private readonly paymentOptionsMap = computed(() => {
    const map = new Map<EntityId, Partial<PaymentOption>>()
    this.paymentOptions().forEach(option => map.set(option.id!, option))
    return map
  })

  readonly preselectedPaymentOptions = computed(() => {
    const preselectedOverride = this.preselectedOverride()
    if (preselectedOverride.length > 0) {
      return preselectedOverride.concat(this.otherPaymentOption)
    }
    return this.paymentOptions().slice(0, 3).concat(this.otherPaymentOption)
  })

  readonly hiddenPaymentOptions: Signal<MenuItem[]> = computed(() => {
    const preselectedPaymentOptions = new Set(this.preselectedPaymentOptions())
    return this.paymentOptions()
      .filter(option => !preselectedPaymentOptions.has(option))
      .map(option => ({
        label: option.name,
        value: option.id,
        command: () => this.promoteHiddenOption(option.id!)
      }))
  })

  ngOnInit() {
    this.paymentOptionService.fetch()
  }

  showOtherOptionsIfNecessary(menu: Menu, event: any) {
    if (this.paymentForm.paymentMethodId().value() === this.otherPaymentOption.id) {
      menu.toggle(event)
    }
  }

  promoteHiddenOption(optionToPromote: EntityId) {
    const selectedOption = this.paymentOptionsMap().get(optionToPromote)
    if (selectedOption) {
      const updatedList = this.preselectedPaymentOptions().slice(0, 2)
      updatedList.push(selectedOption)
      this.preselectedOverride.set(updatedList)
      this.paymentForm.paymentMethodId().value.set(optionToPromote as string)
    }
  }

  commitPaymentFormToContext() {
    const salePayment = this.buildSalePaymentCreateRequest()
    if (this.originalSale()?.status === SaleStatus.CONFIRMED) {
      this.salePaymentService.post(salePayment, {onSuccess: this.commitPaymentToContext})
    } else {
      this.commitPaymentToContext(this.enrichForTempDisplay(salePayment))
    }
  }

  private buildSalePaymentCreateRequest(): SalePaymentCreateRequest {
    const paymentFormValue = this.paymentFormValue()
    const methodId = paymentFormValue.paymentMethodId
    const paymentDate = paymentFormValue.useNowForDate ? null : paymentFormValue.paymentDate
    return {
      paymentMethodId: methodId,
      amount: paymentFormValue.amount!,
      reference: paymentFormValue.reference,
      paymentDate: this.zonedDatesService.toZonedISOString(paymentDate),
      saleId: this.originalSale()?.id as string ?? ''
    }
  }

  private readonly commitPaymentToContext = (updatedSalePayment: Partial<SalePayment>)=> {
    const originalSale = this.originalSale()

    if (!!originalSale && !!updatedSalePayment.id) {
      this.paymentReturnedFromBackend.emit(updatedSalePayment)
    } else {
      this.context.addPayment(updatedSalePayment)
    }

    this.paymentFormValue.set({
      ...SalePaymentFormDefinition.createInitial,
      paymentMethodId: this.paymentFormValue().paymentMethodId
    })
  }

  private enrichForTempDisplay(salePaymentCreateRequest: SalePaymentCreateRequest): Partial<SalePayment> {
    const paymentMethodName = this.paymentOptionsMap().get(salePaymentCreateRequest.paymentMethodId)?.name ?? ''
    const paymentDate = salePaymentCreateRequest.paymentDate
      ? new Date(salePaymentCreateRequest.paymentDate) : undefined
    return {
      ...salePaymentCreateRequest,
      paymentMethodName,
      paymentDateFormModel: paymentDate,
      fakeId: this.sequentialIdGenerator.next()
    }
  }
}
