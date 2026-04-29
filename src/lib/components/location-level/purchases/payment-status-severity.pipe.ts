import {Pipe, PipeTransform} from '@angular/core'
import {PaymentStatus} from '../../../api/location-level/purchase/payment-status.enum'
import {RtsSeverity} from '../../../utils/types/severity'

@Pipe({name: 'paymentStatusSeverity', standalone: true})
export class PaymentStatusSeverityPipe implements PipeTransform {
  transform(paymentStatus?: PaymentStatus): RtsSeverity {
    switch (paymentStatus) {
      case PaymentStatus.UNPAID:
        return RtsSeverity.WARN
      case PaymentStatus.PARTIALLY_SETTLED:
        return RtsSeverity.INFO
      case PaymentStatus.FULLY_SETTLED:
        return RtsSeverity.SUCCESS
      case PaymentStatus.OVERPAID:
        return RtsSeverity.DANGER
      default:
        return RtsSeverity.SECONDARY
    }
  }
}
