import {CurrencyPipe, DatePipe, NgClass} from '@angular/common'
import {Component, inject, signal} from '@angular/core'
import {Button} from 'primeng/button'
import {Card} from 'primeng/card'
import {InputText} from 'primeng/inputtext'
import {Tag} from 'primeng/tag'
import {SalePayment, SaleSession} from '../../../../../api/location-level/sale_session/sale-session.model'
import {SaleSessionService} from '../../../../../api/location-level/sale_session/sale-session.service'
import {AutoStretchDirective} from '../../../../reusable/auto-stretch.directive'
import {SaleFormContext} from '../../form-utils/sale-form-context'

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
    AutoStretchDirective
  ]
})
export class SalePaymentsGridComponent {
  private readonly context = inject(SaleFormContext)
  private readonly saleSessionService = inject(SaleSessionService)

  readonly payments = this.context.payments
  readonly paymentGettingVoided = signal('')

  removePayment(payment: SalePayment) {
    if (payment.identity.id) {
      if (this.paymentGettingVoided() === payment.identity.id) {
        this.paymentGettingVoided.set('')
      } else {
        this.paymentGettingVoided.set(payment.identity.id)
      }
    } else if (payment.identity.transientId) {
      this.saleSessionService.removePayment(
        {identity: payment.identity},
        {onSuccess: this.context.loadSession}
      )
    }
  }

  confirmVoidPayment(voidReason: string) {
    if (this.paymentGettingVoided()) {
      this.saleSessionService.removePayment(
        {identity: {id: this.paymentGettingVoided()}, voidReason},
        {onSuccess: this.onSuccessfulVoid}
      )
    }
  }

  private readonly onSuccessfulVoid = (updatedSession: SaleSession) => {
    this.paymentGettingVoided.set('')
    this.context.loadSession(updatedSession)
  }
}
