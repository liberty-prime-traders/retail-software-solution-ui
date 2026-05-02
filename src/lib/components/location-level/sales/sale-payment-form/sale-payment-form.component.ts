import {Component, computed, inject, model, OnInit, output, signal, Signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {EntityId} from '@ngrx/signals/entities'
import {MenuItem} from 'primeng/api'
import {Button} from 'primeng/button'
import {DatePicker} from 'primeng/datepicker'
import {InputNumber} from 'primeng/inputnumber'
import {InputText} from 'primeng/inputtext'
import {Menu} from 'primeng/menu'
import {SelectButton} from 'primeng/selectbutton'
import {SalePayment} from '../../../../api/location-level/sale/sale-payment.model'
import {PaymentOption} from '../../../../api/organization-level/payment-option/payment-option.model.'
import {PaymentOptionService} from '../../../../api/organization-level/payment-option/payment-option.service'
import {SequentialIdGenerator} from '../../../../utils/services/sequential-id-generator'
import {FormFieldDirection} from '../../../reusable/form-field/form-field-direction'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {LoadingContainerComponent} from '../../../reusable/loading-container/loading-container.component'

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
    FormsModule
  ]
})
export class SalePaymentFormComponent implements OnInit {
  private readonly paymentOptionService = inject(PaymentOptionService)
  private readonly sequentialIdGenerator = inject(SequentialIdGenerator)

  readonly paymentAdded = output<SalePayment>()

  readonly FormFieldDirection = FormFieldDirection
  private readonly otherPaymentOption: Partial<PaymentOption> = {id: 'other', name: 'Other'}
  private readonly preselectedOverride = signal<Partial<PaymentOption>[]>([])
  readonly selectedPaymentOption = model<EntityId>('')
  readonly showDateField = signal(false)
  readonly paymentOptions: Signal<Partial<PaymentOption>[]> = this.paymentOptionService.selectAll
  readonly paymentOptionsLoading = this.paymentOptionService.selectLoading

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
    if (this.selectedPaymentOption() === this.otherPaymentOption.id) {
      menu.toggle(event)
    }
  }

  promoteHiddenOption(optionToPromote: EntityId) {
    const selectedOption = this.paymentOptionsMap().get(optionToPromote)
    if (selectedOption) {
      const updatedList = this.preselectedPaymentOptions().slice(0,2)
      updatedList.push(selectedOption)
      this.preselectedOverride.set(updatedList)
      this.selectedPaymentOption.set(optionToPromote)
    }
  }

  emitNewPayment() {
    this.paymentAdded.emit({
      paymentMethodId: this.selectedPaymentOption(),
      paymentMethodName: this.paymentOptionsMap().get(this.selectedPaymentOption())?.name ?? '',
      amount: 0,
      paymentDate: (new Date()).toLocaleDateString(),
      saleId: '',
      fakeId: this.sequentialIdGenerator.next()
    })
  }

}
