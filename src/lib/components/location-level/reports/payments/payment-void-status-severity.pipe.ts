import {Pipe, PipeTransform} from '@angular/core'
import {PaymentVoidStatus} from '../../../../api/location-level/payment/payment-void-status.enum'
import {RtsSeverity} from '../../../../utils/types/severity'

@Pipe({name: 'paymentVoidStatusSeverity', standalone: true})
export class PaymentVoidStatusSeverityPipe implements PipeTransform {
  transform(status?: PaymentVoidStatus): RtsSeverity {
    switch (status) {
      case PaymentVoidStatus.ACTIVE:
        return RtsSeverity.SUCCESS
      case PaymentVoidStatus.VOIDED:
        return RtsSeverity.DANGER
      default:
        return RtsSeverity.SECONDARY
    }
  }
}
