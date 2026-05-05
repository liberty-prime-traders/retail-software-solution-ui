import {CurrencyPipe, DatePipe} from '@angular/common'
import {Component, inject} from '@angular/core'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {Tag} from 'primeng/tag'
import {Sale} from '../../../../api/location-level/sale/sale.model'
import {SaleService} from '../../../../api/location-level/sale/sale.service'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../../utils/pipes/prettify-enum.pipe'
import {AutoStretchDirective} from '../../../reusable/auto-stretch.directive'
import {GridWithAddButtonComponent} from '../../../reusable/grid-with-add-button.component'
import {PaymentStatusSeverityPipe} from '../../purchases/payment-status-severity.pipe'
import {SaleFormContext} from '../form-utils/sale-form-context'
import {SaleStatusSeverityPipe} from '../sale-status-severity.pipe'

@Component({
  selector: 'rts-sale-grid',
  templateUrl: 'sale-grid.component.html',
  imports: [
    TableModule,
    Button,
    Tag,
    NullSafePipe,
    PrettifyEnumPipe,
    SaleStatusSeverityPipe,
    PaymentStatusSeverityPipe,
    DatePipe,
    CurrencyPipe,
    AutoStretchDirective
  ]
})
export class SaleGridComponent extends GridWithAddButtonComponent<SaleService> {
  private readonly saleService = inject(SaleService)
  protected readonly context = inject(SaleFormContext)
  protected override readonly apiService = this.saleService

  readonly sales = this.saleService.selectAll

  onEditSale(sale: Sale) {
    this.context.initializeForm(sale)
  }
}
