import {Pipe, PipeTransform} from '@angular/core'
import {SalePaymentStatus} from '../../../api/location-level/sale-payment/sale-payment-status.enum'
import {RtsSeverity} from '../../../utils/types/severity'

@Pipe({name: 'salePaymentStatusSeverity', standalone: true})
export class SalePaymentStatusSeverityPipe implements PipeTransform {
  transform(status?: SalePaymentStatus): RtsSeverity {
    switch (status) {
      case SalePaymentStatus.ACTIVE:
        return RtsSeverity.SUCCESS
      case SalePaymentStatus.VOIDED:
        return RtsSeverity.DANGER
      default:
        return RtsSeverity.SECONDARY
    }
  }
}
