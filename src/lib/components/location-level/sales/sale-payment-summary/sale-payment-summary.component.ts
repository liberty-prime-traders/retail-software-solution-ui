import {CurrencyPipe} from '@angular/common'
import {Component, signal} from '@angular/core'
import {Button} from 'primeng/button'
import {Card} from 'primeng/card'
import {Message} from 'primeng/message'
import {Tag} from 'primeng/tag'
import {SalePayment} from '../../../../api/location-level/sale/sale-payment.model'
import {AutoStretchDirective} from '../../../reusable/auto-stretch.directive'
import {SalePaymentFormComponent} from '../sale-payment-form/sale-payment-form.component'

@Component({
  selector: 'rts-sale-payment-summary',
  styleUrl: 'sale-payment-summary.component.scss',
  imports: [
    AutoStretchDirective,
    Button,
    Card,
    CurrencyPipe,
    Message,
    SalePaymentFormComponent,
    Tag
  ],
  templateUrl: 'sale-payment-summary.component.html'
})
export class SalePaymentSummaryComponent {

  readonly payments = signal<SalePayment[]>([])

  receiveNewPayment(salePayment: SalePayment) {
    this.payments.update(payments => [...payments, salePayment])
  }
}
