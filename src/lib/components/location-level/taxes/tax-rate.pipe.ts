import {CurrencyPipe, DecimalPipe} from '@angular/common'
import {inject, Pipe, PipeTransform} from '@angular/core'
import {CalculationMethod} from '../../../api/platform-level/tax-type/calculation-method.enum'

@Pipe({name: 'taxRate', standalone: true})
export class TaxRatePipe implements PipeTransform {
  private readonly currencyPipe = inject(CurrencyPipe)
  private readonly decimalPipe = inject(DecimalPipe)

  transform(rate: number, calculationMethod: CalculationMethod): string {
    if (calculationMethod === CalculationMethod.PERCENTAGE) {
      return `${this.decimalPipe.transform(rate, '1.0-4')}%`
    }
    return `${this.currencyPipe.transform(rate)} / unit`
  }
}
