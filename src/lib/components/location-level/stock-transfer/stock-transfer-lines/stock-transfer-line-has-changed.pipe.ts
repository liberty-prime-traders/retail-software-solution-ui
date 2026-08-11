import {Pipe, PipeTransform} from '@angular/core'
import {StockTransferLineFormDefinition} from './stock-transfer-line-form.definition'

@Pipe({name: 'stockTransferLineHasChanged', standalone: true})
export class StockTransferLineHasChangedPipe implements PipeTransform {
  transform(line: StockTransferLineFormDefinition.StockTransferLineFormModel): boolean {
    return StockTransferLineFormDefinition.hasChanged(line)
  }
}
