import {CurrencyPipe, DatePipe} from '@angular/common'
import {Component, computed, inject} from '@angular/core'
import {TableModule} from 'primeng/table'
import {Tag} from 'primeng/tag'
import {Button} from 'primeng/button'
import {StockTransferSummary} from '../../../../api/cross-tier/stock-transfer/stock-transfer-summary.model'
import {StockTransferSummaryService} from '../../../../api/cross-tier/stock-transfer/stock-transfer-summary.service'
import {StockTransferService} from '../../../../api/location-level/stock-transfer/stock-transfer.service'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../../utils/pipes/prettify-enum.pipe'
import {AutoStretchDirective} from '../../../reusable/auto-stretch.directive'
import {StockTransferFormContext} from '../stock-transfer-form/stock-transfer-form-context'
import {StockTransferStatusSeverityPipe} from '../stock-transfer-status-severity.pipe'

@Component({
  selector: 'rts-location-stock-transfer-grid',
  templateUrl: 'stock-transfer-grid.component.html',
  imports: [
    AutoStretchDirective,
    TableModule,
    Tag,
    Button,
    NullSafePipe,
    PrettifyEnumPipe,
    StockTransferStatusSeverityPipe,
    DatePipe,
    CurrencyPipe
  ]
})
export class StockTransferGridComponent {
  private readonly stockTransferSummaryService = inject(StockTransferSummaryService)
  private readonly stockTransferService = inject(StockTransferService)
  protected readonly context = inject(StockTransferFormContext)

  readonly stockTransfers = this.stockTransferSummaryService.selectAll
  readonly loading = computed(() =>
    this.stockTransferSummaryService.selectLoading() || this.stockTransferService.selectLoading()
  )

  onEditTransfer(summary: StockTransferSummary) {
    this.stockTransferService.loadTransfer(summary.referenceNumber, {
      onSuccess: (response) => this.context.viewTransfer(response)
    })
  }
}
