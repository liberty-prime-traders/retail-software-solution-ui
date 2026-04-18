import {Pipe, PipeTransform} from '@angular/core'
import {PaymentStatus} from '../../../api/location-level/purchase/payment-status.enum'

@Pipe({name: 'paymentStatusSeverity', standalone: true})
export class PaymentStatusSeverityPipe implements PipeTransform {
  transform(paymentStatus?: PaymentStatus) {
    switch (paymentStatus) {
    case PaymentStatus.UNPAID:
      return 'warn'
    case PaymentStatus.PARTIALLY_SETTLED:
      return 'info'
    case PaymentStatus.FULLY_SETTLED:
      return 'success'
    default:
      return 'secondary'
    }
  }
}
