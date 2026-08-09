import {Component, inject} from '@angular/core'
import {Button} from 'primeng/button'
import {StockTransferSummaryService} from '../../../api/cross-tier/stock-transfer/stock-transfer-summary.service'
import {HidesSaleButtonComponent} from '../hides-sale-button.component'
import {StockTransferFormContext} from './stock-transfer-form/stock-transfer-form-context'
import {StockTransferFormComponent} from './stock-transfer-form/stock-transfer-form.component'
import {StockTransferGridComponent} from './stock-transfer-grid/stock-transfer-grid.component'

@Component({
  selector: 'rts-location-stock-transfer',
  templateUrl: 'stock-transfer.component.html',
  providers: [StockTransferFormContext],
  imports: [
    Button,
    StockTransferGridComponent,
    StockTransferFormComponent
  ]
})
export class StockTransferComponent extends HidesSaleButtonComponent {
  private readonly stockTransferSummaryService = inject(StockTransferSummaryService)
  private readonly context = inject(StockTransferFormContext)
  readonly formIsVisible = this.context.formIsVisible

  override ngOnInit() {
    super.ngOnInit()
    this.stockTransferSummaryService.fetch()
  }

  startNewTransfer() {
    this.context.startNewTransfer()
  }

  hideForm() {
    this.context.hideForm()
  }
}
