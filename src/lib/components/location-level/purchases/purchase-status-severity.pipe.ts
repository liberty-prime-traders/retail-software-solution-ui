import {Pipe, PipeTransform} from '@angular/core'
import {PurchaseStatus} from '../../../api/location-level/purchase/purchase-status.enum'
import {RtsSeverity} from '../../../utils/types/severity'

@Pipe({name: 'purchaseStatusSeverity', standalone: true})
export class PurchaseStatusSeverityPipe implements PipeTransform {
  transform(purchaseStatus?: PurchaseStatus): RtsSeverity {
    switch (purchaseStatus) {
    case PurchaseStatus.DRAFT:
      return RtsSeverity.WARN
    case PurchaseStatus.ORDERED:
      return RtsSeverity.SECONDARY
    case PurchaseStatus.PARTIALLY_DELIVERED:
      return RtsSeverity.INFO
    case PurchaseStatus.FULLY_DELIVERED:
      return RtsSeverity.SUCCESS
    case PurchaseStatus.CANCELED:
      return RtsSeverity.DANGER
    default:
      return RtsSeverity.SECONDARY
    }
  }
}
