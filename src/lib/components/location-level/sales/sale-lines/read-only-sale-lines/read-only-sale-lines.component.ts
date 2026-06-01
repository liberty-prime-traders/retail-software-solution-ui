import {CurrencyPipe} from '@angular/common'
import {Component, input} from '@angular/core'
import {TableModule} from 'primeng/table'
import {
  ConversionContextPipe,
  UnitConvertPipe,
  UnitCurrencyPipe
} from '../../../../../api/organization-level/unit-conversion/pipes/unit-convert.pipe'
import {UnitDescriptionPipe} from '../../../../../api/organization-level/unit-conversion/pipes/unit-description.pipe'
import {SaleLineFormDefinition} from '../../form-utils/sale-line-form.definition'

@Component({
  selector: 'rts-read-only-sale-lines',
  templateUrl: 'read-only-sale-lines.component.html',
  imports: [
    TableModule,
    UnitDescriptionPipe,
    ConversionContextPipe,
    UnitConvertPipe,
    CurrencyPipe,
    UnitCurrencyPipe
  ]

})
export class ReadOnlySaleLinesComponent {
  readonly saleLines = input.required<SaleLineFormDefinition.SaleLineFormModel[]>()

}
