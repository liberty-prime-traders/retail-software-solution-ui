import {Component, inject} from '@angular/core'
import {StockTransferResponse} from '../../../../api/location-level/stock-transfer/stock-transfer-response.model'
import {StockTransferCreateFormComponent} from './stock-transfer-create-form.component'
import {StockTransferDetailComponent} from './stock-transfer-detail.component'
import {StockTransferFormContext} from './stock-transfer-form-context'

@Component({
  selector: 'rts-location-stock-transfer-form',
  templateUrl: 'stock-transfer-form.component.html',
  imports: [
    StockTransferCreateFormComponent,
    StockTransferDetailComponent
  ]
})
export class StockTransferFormComponent {
  protected readonly context = inject(StockTransferFormContext)

  onTransferCreated(stockTransfer: StockTransferResponse) {
    this.context.viewTransfer(stockTransfer)
  }
}
