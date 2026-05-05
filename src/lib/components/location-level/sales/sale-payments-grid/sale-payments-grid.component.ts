import {CurrencyPipe, DatePipe, NgClass} from '@angular/common'
import {Component, inject, output, signal} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {Button} from 'primeng/button'
import {Card} from 'primeng/card'
import {InputText} from 'primeng/inputtext'
import {Tag} from 'primeng/tag'
import {SalePayment} from '../../../../api/location-level/sale-payment/sale-payment.model'
import {SalePaymentService} from '../../../../api/location-level/sale-payment/sale-payment.service'
import {ErrorSummaryComponent} from '../../../reusable/error-summary/error-summary.component'
import {LoadingContainerComponent} from '../../../reusable/loading-container/loading-container.component'
import {SaleFormContext} from '../form-utils/sale-form-context'

@Component({
  selector: 'rts-sale-payments-grid',
  templateUrl: 'sale-payments-grid.component.html',
  imports: [
    Button,
    Tag,
    Card,
    DatePipe,
    CurrencyPipe,
    NgClass,
    InputText,
    LoadingContainerComponent,
    ErrorSummaryComponent
  ]
})
export class SalePaymentsGridComponent {
  private readonly context = inject(SaleFormContext)
  private readonly salePaymentService = inject(SalePaymentService)

  readonly paymentReturnedFromBackend = output<Partial<SalePayment>>()
  readonly payments = this.context.payments
  readonly paymentsFailureMessages = this.salePaymentService.selectFailureMessages
  readonly paymentServiceLoading = this.salePaymentService.selectLoading

  readonly paymentGettingVoided = signal<EntityId>('')

  removePayment(payment: Partial<SalePayment>) {
    if (payment.id) {
      if (this.paymentGettingVoided() === payment.id) {
        this.paymentGettingVoided.set('')
      } else {
        this.paymentGettingVoided.set(payment.id)
      }
    } else if (payment.fakeId !== undefined) {
      this.context.removePayment(payment.fakeId)
    }
  }

  confirmVoidPayment(reason: string) {
    if (this.paymentGettingVoided()) {
      this.salePaymentService.voidPayment(
        {salePaymentId: this.paymentGettingVoided(), reason},
        {onSuccess: this.onSuccessfulVoid}
      )
    }
  }

  private readonly onSuccessfulVoid = (updatedPayment: SalePayment) => {
    if (updatedPayment.id === this.paymentGettingVoided()) {
      this.paymentReturnedFromBackend.emit(updatedPayment)
      this.paymentGettingVoided.set('')
    }
  }
}
