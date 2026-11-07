import {Pipe, PipeTransform} from '@angular/core'
import {PaymentVoidStatus} from '../../../../api/location-level/payment/payment-void-status.enum'

@Pipe({name: 'voidedToVoidStatus', standalone: true})
export class VoidedToVoidStatusPipe implements PipeTransform {
  transform(voided: boolean): PaymentVoidStatus {
    return voided ? PaymentVoidStatus.VOIDED : PaymentVoidStatus.ACTIVE
  }
}
