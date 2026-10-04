import {Pipe, PipeTransform} from '@angular/core'
import {TaxSourceType} from '../../../api/location-level/tax-entry/tax-source-type.enum'
import {RtsSeverity} from '../../../utils/types/severity'

@Pipe({name: 'taxSourceTypeSeverity', standalone: true})
export class TaxSourceTypeSeverityPipe implements PipeTransform {
  transform(sourceType?: TaxSourceType): RtsSeverity {
    switch (sourceType) {
      case TaxSourceType.SALE:
        return RtsSeverity.SUCCESS
      case TaxSourceType.SALE_VOID:
        return RtsSeverity.DANGER
      case TaxSourceType.PURCHASE_DELIVERY:
        return RtsSeverity.INFO
      default:
        return RtsSeverity.SECONDARY
    }
  }
}
