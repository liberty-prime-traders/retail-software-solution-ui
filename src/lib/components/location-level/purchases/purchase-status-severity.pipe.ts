import {Pipe, PipeTransform} from '@angular/core'
import {PurchaseStatus} from '../../../api/location-level/purchase/purchase-status.enum'

@Pipe({name: 'purchaseStatusSeverity', standalone: true})
export class PurchaseStatusSeverityPipe implements PipeTransform {
  transform(purchaseStatus?: PurchaseStatus) {
    switch (purchaseStatus) {
    case PurchaseStatus.DRAFT:
      return 'secondary'
    case PurchaseStatus.ORDERED:
      return 'info'
    case PurchaseStatus.PARTIALLY_DELIVERED:
      return 'warn'
    case PurchaseStatus.FULLY_DELIVERED:
      return 'success'
    case PurchaseStatus.CANCELED:
      return 'danger'
    default:
      return 'secondary'
    }
  }
}
