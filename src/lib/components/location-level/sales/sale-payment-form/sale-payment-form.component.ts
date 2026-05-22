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
import {SaleSessionPaymentAddRequest} from '../../../../api/location-level/sale_session/sale-session-requests.model'
import {SalePayment} from '../../../../api/location-level/sale_session/sale-session.model'
import {SaleSessionService} from '../../../../api/location-level/sale_session/sale-session.service'
import {PaymentOption} from '../../../../api/organization-level/payment-option/payment-option.model.'
import {PaymentOptionService} from '../../../../api/organization-level/payment-option/payment-option.service'
import {ZonedDatesService} from '../../../../utils/services/zoned-dates.service'
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
    CurrencyPipe
  ]
})
export class SalePaymentFormComponent implements OnInit {
  private readonly paymentOptionService = inject(PaymentOptionService)
  private readonly context = inject(SaleFormContext)
  private readonly zonedDatesService = inject(ZonedDatesService)
  private readonly saleSessionService = inject(SaleSessionService)

  readonly FormFieldDirection = FormFieldLayout
  private readonly otherPaymentOption: Partial<PaymentOption> = {id: 'other', name: 'Other'}
  readonly paymentOptions: Signal<Partial<PaymentOption>[]> = this.paymentOptionService.selectAll
  readonly paymentOptionsLoading = this.paymentOptionService.selectLoading
  private readonly preselectedOverride = signal<Partial<PaymentOption>[]>([])
  private readonly paymentFormValue = signal(SalePaymentFormDefinition.createInitial)

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

  addPayment() {
    const salePayment = this.buildSalePaymentCreateRequest()
    this.saleSessionService.addPayment(salePayment, {
      onSuccess: (updatedSession) => {
        this.paymentFormValue.set({
          ...SalePaymentFormDefinition.createInitial,
          paymentMethodId: this.paymentFormValue().paymentMethodId
        })
        this.context.onSuccessfulSave(updatedSession)
      }
    })
  }

  private buildSalePaymentCreateRequest(): SaleSessionPaymentAddRequest {
    const paymentFormValue = this.paymentFormValue()
    const paymentDate = paymentFormValue.useNowForDate ? null : paymentFormValue.paymentDate
    return {
      paymentMethodId: paymentFormValue.paymentMethodId,
      amount: paymentFormValue.amount!,
      reference: paymentFormValue.reference,
      paymentDate: this.zonedDatesService.toZonedISOString(paymentDate)
    }
  }
}
