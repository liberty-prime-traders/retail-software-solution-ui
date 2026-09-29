import {CurrencyPipe, DatePipe} from '@angular/common'
import {Component, effect, inject, viewChild} from '@angular/core'
import {ButtonDirective} from 'primeng/button'
import {Skeleton} from 'primeng/skeleton'
import {Table, TableModule} from 'primeng/table'
import {TableLazyLoadEvent} from 'primeng/types/table'
import {Tag} from 'primeng/tag'
import {PurchaseSearchResult} from '../../../../api/location-level/purchase/purchase-search-result.model'
import {PurchaseSearchResultService} from '../../../../api/location-level/purchase/purchase-search-result.service'
import {PurchaseService} from '../../../../api/location-level/purchase/purchase.service'
import {loadNextOnLazyLoad} from '../../../../api/util/paginated-api/paginated-lazy-load.util'
import {resetVirtualScrollOnSearch} from '../../../../utils/primeng-table.util'
import {NullSafePipe} from '../../../../utils/pipes/null-safe.pipe'
import {PrettifyEnumPipe} from '../../../../utils/pipes/prettify-enum.pipe'
import {AutoStretchDirective} from '../../../reusable/auto-stretch.directive'
import {EmptyRowComponent} from '../../../reusable/empty-row/empty-row.component'
import {PaymentStatusSeverityPipe} from '../payment-status-severity.pipe'
import {PurchaseFormContext} from '../purchase-form/form-utils/purchase-form-context'
import {PurchaseStatusSeverityPipe} from '../purchase-status-severity.pipe'

@Component({
  selector: 'rts-purchase-grid',
  templateUrl: 'purchase-grid.component.html',
  imports: [
    TableModule,
    ButtonDirective,
    Tag,
    Skeleton,
    NullSafePipe,
    PrettifyEnumPipe,
    PurchaseStatusSeverityPipe,
    DatePipe,
    AutoStretchDirective,
    CurrencyPipe,
    PaymentStatusSeverityPipe,
    EmptyRowComponent
  ]
})
export class PurchaseGridComponent {
  private readonly purchaseSearchResultService = inject(PurchaseSearchResultService)
  private readonly purchaseService = inject(PurchaseService)
  protected readonly context = inject(PurchaseFormContext)

  private readonly table = viewChild(Table)

  readonly purchases = this.purchaseSearchResultService.selectAll
  readonly loading = this.purchaseSearchResultService.selectLoading

  readonly $resetScrollOnSearch = effect(() => {
    this.purchaseSearchResultService.freshLoadCompleted()
    const table = this.table()
    if (table) {
      resetVirtualScrollOnSearch(table)
    }
  })

  onLazyLoad(lazyLoadEvent: TableLazyLoadEvent): void {
    loadNextOnLazyLoad(this.purchaseSearchResultService, lazyLoadEvent.last)
  }

  onEditPurchase(purchase: PurchaseSearchResult) {
    // Keep PurchaseStore in sync so selectForId() lookups elsewhere (e.g. supplier
    // payment/delivery forms) resolve, even for purchases only seen via search.
    this.purchaseService.applyResponse(purchase)
    this.context.initializeForm(purchase)
  }
}
