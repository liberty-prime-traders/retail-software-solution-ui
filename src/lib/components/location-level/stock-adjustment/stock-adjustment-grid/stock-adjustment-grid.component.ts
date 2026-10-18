import {CurrencyPipe, DatePipe} from '@angular/common'
import {Component, inject, OnInit} from '@angular/core'
import {TableModule} from 'primeng/table'
import {StockAdjustmentService} from '../../../../api/location-level/stock-adjustment/stock-adjustment.service'
import {UnitDescriptionPipe} from '../../../../api/organization-level/unit-conversion/pipes/unit-description.pipe'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../../utils/pipes/prettify-enum.pipe'
import {AutoStretchDirective} from '../../../reusable/auto-stretch.directive'
import {EmptyRowComponent} from '../../../reusable/empty-row/empty-row.component'

@Component({
  selector: 'rts-location-stock-adjustment-grid',
  templateUrl: 'stock-adjustment-grid.component.html',
  imports: [
    AutoStretchDirective,
    TableModule,
    EmptyRowComponent,
    CurrencyPipe,
    DatePipe,
    NullSafePipe,
    PrettifyEnumPipe,
    UnitDescriptionPipe
  ]
})
export class StockAdjustmentGridComponent implements OnInit {
  private readonly stockAdjustmentService = inject(StockAdjustmentService)

  readonly stockAdjustments = this.stockAdjustmentService.selectAll
  readonly loading = this.stockAdjustmentService.selectLoading

  ngOnInit() {
    this.stockAdjustmentService.fetch()
  }
}
