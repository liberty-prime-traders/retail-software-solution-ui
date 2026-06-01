import {Pipe, PipeTransform} from '@angular/core'
import {SaleStatus} from '../../../api/location-level/sale-summary/sale-status.enum'
import {RtsSeverity} from '../../../utils/types/severity'

@Pipe({name: 'saleStatusSeverity', standalone: true})
export class SaleStatusSeverityPipe implements PipeTransform {
  transform(status?: SaleStatus): RtsSeverity {
    switch (status) {
      case SaleStatus.DRAFT:
        return RtsSeverity.SECONDARY
      case SaleStatus.CONFIRMED:
        return RtsSeverity.SUCCESS
      case SaleStatus.VOIDED:
        return RtsSeverity.DANGER
      case SaleStatus.DISCARDED:
        return RtsSeverity.DANGER
      default:
        return RtsSeverity.SECONDARY
      }
  }
}
