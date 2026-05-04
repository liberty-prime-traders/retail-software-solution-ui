import {CurrencyPipe, DatePipe, NgClass} from '@angular/common'
import {Component, inject} from '@angular/core'
import {Button} from 'primeng/button'
import {Card} from 'primeng/card'
import {Tag} from 'primeng/tag'
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
    NgClass
  ]
})
export class SalePaymentsGridComponent {
  private readonly context = inject(SaleFormContext)
  readonly payments = this.context.payments

  removePayment(paymentId?: number) {
    this.context.removePayment(paymentId)
  }
}
