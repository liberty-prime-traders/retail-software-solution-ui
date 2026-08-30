import {Pipe, PipeTransform} from '@angular/core'
import {StockTransferStatus} from '../../../api/cross-tier/stock-transfer/stock-transfer-status.enum'
import {RtsSeverity} from '../../../utils/types/severity'

@Pipe({name: 'stockTransferStatusSeverity', standalone: true})
export class StockTransferStatusSeverityPipe implements PipeTransform {
  transform(status?: StockTransferStatus): RtsSeverity {
    switch (status) {
    case StockTransferStatus.DRAFT:
      return RtsSeverity.WARN
    case StockTransferStatus.DISPATCHED:
      return RtsSeverity.INFO
    case StockTransferStatus.COMPLETED:
      return RtsSeverity.SUCCESS
    case StockTransferStatus.CANCELLED:
      return RtsSeverity.DANGER
    default:
      return RtsSeverity.SECONDARY
    }
  }
}
