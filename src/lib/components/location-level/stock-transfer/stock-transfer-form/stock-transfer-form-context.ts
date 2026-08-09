import {computed, Injectable, signal} from '@angular/core'
import {StockTransferStatus} from '../../../../api/cross-tier/stock-transfer/stock-transfer-status.enum'
import {StockTransferResponse} from '../../../../api/location-level/stock-transfer/stock-transfer-response.model'

@Injectable()
export class StockTransferFormContext {

  private readonly selectedTransfer = signal<StockTransferResponse | null>(null)
  readonly formIsVisible = signal(false)

  readonly transfer = this.selectedTransfer.asReadonly()
  readonly orderRef = computed(() => this.selectedTransfer()?.summary.referenceNumber)
  readonly status = computed(() => this.selectedTransfer()?.dispatch.status)
  readonly isNew = computed(() => !this.selectedTransfer())
  readonly isDraft = computed(() => this.status() === StockTransferStatus.DRAFT)

  viewTransfer(stockTransfer: StockTransferResponse) {
    this.formIsVisible.set(true)
    this.selectedTransfer.set(stockTransfer)
  }

  startNewTransfer() {
    this.formIsVisible.set(true)
    this.selectedTransfer.set(null)
  }

  hideForm() {
    this.formIsVisible.set(false)
  }
}
