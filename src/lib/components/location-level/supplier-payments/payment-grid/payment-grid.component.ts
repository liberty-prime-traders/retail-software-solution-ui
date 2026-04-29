import {CurrencyPipe, NgClass} from '@angular/common'
import {TimezoneAwareDatePipe} from '../../../../utils/pipes/timezone-aware-date.pipe'
import {Component, effect, inject, input, output, signal, untracked} from '@angular/core'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {SupplierPaymentService} from '../../../../api/location-level/supplier-payment/supplier-payment.service'
import {EmptyRowComponent} from '../../../reusable/empty-row/empty-row.component'
import {TooltipComponent} from '../../../reusable/tooltip/tooltip.component'
import {PaymentExpandedRowComponent} from '../payment-expanded-row/payment-expanded-row.component'
import {PaymentFormComponent} from '../payment-form/payment-form.component'

@Component({
  selector: 'rts-supplier-payment-grid',
  templateUrl: 'payment-grid.component.html',
  imports: [
    TableModule,
    Button,
    CurrencyPipe,
    TimezoneAwareDatePipe,
    NgClass,
    EmptyRowComponent,
    TooltipComponent,
    PaymentFormComponent,
    PaymentExpandedRowComponent
  ]
})
export class PaymentGridComponent {
  readonly purchaseId = input.required<string>()
  readonly canAddPayment = input<boolean>(false)

  readonly paymentChanged = output()

  private readonly supplierPaymentService = inject(SupplierPaymentService)

  readonly payments = this.supplierPaymentService.selectForGroup(this.purchaseId)
  readonly showAddForm = signal(false)

  private readonly refetchPayments = effect(() => {
    const purchaseId = this.purchaseId()
    untracked(() => this.supplierPaymentService.refetch(purchaseId))
  })

  onPaymentChange() {
    this.showAddForm.set(false)
    this.paymentChanged.emit()
  }
}
