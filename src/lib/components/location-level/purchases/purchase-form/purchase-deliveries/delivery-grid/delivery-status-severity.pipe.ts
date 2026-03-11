import {Pipe, PipeTransform} from '@angular/core'
import {PurchaseDeliveryStatus} from '../../../../../../api/location-level/delivery/purchase-delivery-status.enum'
import {RtsSeverity} from '../../../../../../utils/types/severity'

@Pipe({name: 'deliveryStatusSeverity', standalone: true})
export class DeliveryStatusSeverityPipe implements PipeTransform {
  transform(status?: PurchaseDeliveryStatus): RtsSeverity {
    switch (status) {
      case PurchaseDeliveryStatus.PROCESSING:
        return RtsSeverity.WARN
      case PurchaseDeliveryStatus.RECEIVED:
        return RtsSeverity.SUCCESS
      case PurchaseDeliveryStatus.FAILED:
        return RtsSeverity.DANGER
      default:
        return RtsSeverity.INFO
    }
  }
}
