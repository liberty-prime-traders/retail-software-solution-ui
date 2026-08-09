import {Component, inject} from '@angular/core'
import {Button} from 'primeng/button'
import {Tag} from 'primeng/tag'
import {StockTransferService} from '../../../../api/location-level/stock-transfer/stock-transfer.service'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../../utils/pipes/prettify-enum.pipe'
import {AutoStretchDirective} from '../../../reusable/auto-stretch.directive'
import {ErrorSummaryComponent} from '../../../reusable/error-summary/error-summary.component'
import {LoadingContainerComponent} from '../../../reusable/loading-container/loading-container.component'
import {StockTransferStatusSeverityPipe} from '../stock-transfer-status-severity.pipe'
import {StockTransferFormContext} from './stock-transfer-form-context'

@Component({
  selector: 'rts-location-stock-transfer-detail',
  templateUrl: 'stock-transfer-detail.component.html',
  imports: [
    Button,
    Tag,
    NullSafePipe,
    PrettifyEnumPipe,
    StockTransferStatusSeverityPipe,
    ErrorSummaryComponent,
    LoadingContainerComponent,
    AutoStretchDirective
  ]
})
export class StockTransferDetailComponent {
  private readonly stockTransferService = inject(StockTransferService)
  protected readonly context = inject(StockTransferFormContext)

  readonly transfer = this.context.transfer
  readonly isDraft = this.context.isDraft
  readonly loading = this.stockTransferService.selectLoading
  readonly failureMessages = this.stockTransferService.selectFailureMessages

  dispatchTransfer() {
    const orderRef = this.context.orderRef()
    if (orderRef) {
      this.stockTransferService.dispatch(orderRef, {onSuccess: (response) => this.context.viewTransfer(response)})
    }
  }

  cancelTransfer() {
    const orderRef = this.context.orderRef()
    if (orderRef) {
      this.stockTransferService.cancelTransfer(orderRef, {onSuccess: (response) => this.context.viewTransfer(response)})
    }
  }
}
