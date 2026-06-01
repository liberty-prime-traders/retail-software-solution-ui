import {Pipe, PipeTransform} from '@angular/core'
import {SaleLineFormDefinition} from '../form-utils/sale-line-form.definition'

@Pipe({name: 'saleLineHasChanged', standalone: true})
export class SaleLineHasChangedPipe implements PipeTransform {

  transform(saleLine: SaleLineFormDefinition.SaleLineFormModel): boolean {
    return SaleLineFormDefinition.hasChanged(saleLine)
  }
}
