import {CurrencyPipe} from '@angular/common'
import {Component, computed, inject} from '@angular/core'
import {Panel} from 'primeng/panel'
import {Table} from 'primeng/table'
import {PurchaseSearchSummaryService} from '../../../api/location-level/purchase/purchase-search-summary.service'
import {PrettifyEnumPipe} from '../../../utils/pipes/prettify-enum.pipe'
import {EmptyRowComponent} from '../../reusable/empty-row/empty-row.component'

@Component({
  selector: 'rts-purchases-summary',
  imports: [
    Table,
    Panel,
    CurrencyPipe,
    PrettifyEnumPipe,
    EmptyRowComponent
  ],
  templateUrl: 'purchases-summary.component.html'
})
export class PurchasesSummaryComponent {
  private readonly purchaseSearchSummaryService = inject(PurchaseSearchSummaryService)

  readonly purchaseSearchSummary = this.purchaseSearchSummaryService.purchaseSearchSummary
  readonly purchaseCount = this.purchaseSearchSummaryService.purchaseCount

  readonly totalOrdered = computed(() => this.purchaseSearchSummary()?.totalOrdered ?? 0)
  readonly totalPaid = computed(() => this.purchaseSearchSummary()?.totalPaid ?? 0)
  readonly totalOutstanding = computed(() => this.purchaseSearchSummary()?.totalOutstanding ?? 0)

  readonly byPaymentStatus = computed(() => this.purchaseSearchSummary()?.byPaymentStatus ?? [])
  readonly bySupplier = computed(() => this.purchaseSearchSummary()?.bySupplier ?? [])
}
