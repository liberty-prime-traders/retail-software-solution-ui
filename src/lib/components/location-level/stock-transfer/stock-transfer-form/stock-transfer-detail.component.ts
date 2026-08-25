import {DatePipe} from '@angular/common'
import {Component, computed, inject} from '@angular/core'
import {Button} from 'primeng/button'
import {Tag} from 'primeng/tag'
import {StockTransferStatus} from '../../../../api/cross-tier/stock-transfer/stock-transfer-status.enum'
import {StockTransferPerspective} from '../../../../api/location-level/stock-transfer/stock-transfer-perspective.enum'
import {StockTransferService} from '../../../../api/location-level/stock-transfer/stock-transfer.service'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../../utils/pipes/prettify-enum.pipe'
import {AutoStretchDirective} from '../../../reusable/auto-stretch.directive'
import {FormFieldLayout} from '../../../reusable/form-field/form-field-layout'
import {FormFieldComponent} from '../../../reusable/form-field/form-field.component'
import {LoadingContainerComponent} from '../../../reusable/loading-container/loading-container.component'
import {StockTransferLinesComponent} from '../stock-transfer-lines/stock-transfer-lines.component'
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
    FormFieldComponent,
    LoadingContainerComponent,
    AutoStretchDirective,
    StockTransferLinesComponent,
    DatePipe
  ]
})
export class StockTransferDetailComponent {
  private readonly stockTransferService = inject(StockTransferService)
  protected readonly context = inject(StockTransferFormContext)

  readonly StockTransferPerspective = StockTransferPerspective
  protected readonly FormFieldLayout = FormFieldLayout

  readonly transfer = this.context.transfer
  readonly transferSummary = computed(() => this.transfer()?.summary)
  readonly hasPendingLineEdits = this.context.hasPendingLineEdits
  readonly loading = this.stockTransferService.selectLoading
  readonly perspective = this.context.perspective
  readonly isDispatched = computed(() => StockTransferStatus.DISPATCHED === this.context.status())
  readonly isDraft =  this.context.isDraft

  private readonly allLinesHaveBeenReceived = computed(() => {
    const receivedLines = this.transfer()?.receipt?.lines?.length ?? 0
    const dispatchedLines = this.transfer()?.dispatch?.lines?.length ?? 0
    return receivedLines === dispatchedLines
  })

  readonly showCompleteTransferButton = computed(() => {
    return this.isDispatched() &&
      this.context.perspective() === StockTransferPerspective.INCOMING &&
      this.allLinesHaveBeenReceived()
  })

  dispatchTransfer() {
    const orderRef = this.context.orderRef()
    if (orderRef) {
      this.stockTransferService.dispatch(
        orderRef,
        {onSuccess: (response) => this.context.viewTransfer(response)}
      )
    }
  }

  cancelTransfer() {
    const orderRef = this.context.orderRef()
    if (orderRef) {
      this.stockTransferService.cancelTransfer(
        orderRef,
        {onSuccess: (response) => this.context.viewTransfer(response)}
      )
    }
  }

  completeTransfer() {
    const receiptRef = this.context.transfer()?.receipt?.referenceNumber
    if (receiptRef) {
      this.stockTransferService.completeTransfer(
        receiptRef,
        {onSuccess: (response) => this.context.viewTransfer(response)}
      )
    }
  }
}
