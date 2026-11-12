import {Component, inject} from '@angular/core'
import {MessageService} from 'primeng/api'
import {ButtonDirective} from 'primeng/button'
import {CardModule} from 'primeng/card'
import {Divider} from 'primeng/divider'
import {
  LastPurchaseCostBackfillService
} from '../../../api/organization-level/admin-data-fixes/last-purchase-cost-backfill.service'
import {
  PurchaseMovementContextBackfillService
} from '../../../api/organization-level/admin-data-fixes/purchase-movement-context-backfill.service'
import {SaleLineCogsBackfillService} from '../../../api/organization-level/admin-data-fixes/sale-line-cogs-backfill.service'
import {StockAdjustmentBackfillService} from '../../../api/organization-level/admin-data-fixes/stock-adjustment-backfill.service'
import {SeedDataApplierService} from '../../../api/organization-level/admin-data-fixes/seed-data-applier.service'
import {LoadingContainerComponent} from '../../reusable/loading-container/loading-container.component'
import {AdminDataFix, AdminDataFixItem} from './admin-data-fix-item.model'

@Component({
  selector: 'rts-admin-data-fixes',
  templateUrl: 'admin-data-fixes.component.html',
  imports: [ButtonDirective, CardModule, Divider, LoadingContainerComponent]
})
export class AdminDataFixesComponent {
  private readonly seedDataApplierService = inject(SeedDataApplierService)
  private readonly saleLineCogsBackfillService = inject(SaleLineCogsBackfillService)
  private readonly stockAdjustmentBackfillService = inject(StockAdjustmentBackfillService)
  private readonly purchaseMovementContextBackfillService = inject(PurchaseMovementContextBackfillService)
  private readonly lastPurchaseCostBackfillService = inject(LastPurchaseCostBackfillService)
  private readonly messageService = inject(MessageService)

  readonly adminDataFixItems: AdminDataFixItem[] = [
    {
      fix: AdminDataFix.SEED_DEFAULTS,
      title: 'Initial Data',
      description: 'We recommend some initial data to be loaded onto each new organization to help them get started. ' +
        'This data includes unit values, product categories, and more. It is very likely that this data was loaded ' +
        'when your organization was created. If you are not seeing any of this data, or if you just want to reload it, ' +
        'use the button. This will not affect any existing data in your organization.',
      buttonLabel: 'Reload Initial Data',
      successDetail: 'Request completed with success',
      requestService: this.seedDataApplierService,
      isLoading: this.seedDataApplierService.isLoading
    },
    {
      fix: AdminDataFix.SALE_LINE_COGS_BACKFILL,
      title: 'Sale Cost Records',
      description: 'Sales confirmed before cost records were introduced need one cost record per sale line in every ' +
        'location. This copies the cost already stored on those lines and skips lines that are done, so it is safe ' +
        'to run again. It runs in the background; completion is written to the server log.',
      buttonLabel: 'Backfill Sale Costs',
      successDetail: 'Backfill started. Check the server log for completion',
      requestService: this.saleLineCogsBackfillService,
      isLoading: this.saleLineCogsBackfillService.isLoading
    },
    {
      fix: AdminDataFix.STOCK_ADJUSTMENT_BACKFILL,
      title: 'Stock Adjustment Cost Records',
      description: 'Stock adjustments recorded before cost records were introduced need one cost record each in ' +
        'every location. This copies the cost already stored on those adjustments and skips adjustments that are ' +
        'done, so it is safe to run again. It runs in the background; completion is written to the server log.',
      buttonLabel: 'Backfill Adjustment Costs',
      successDetail: 'Backfill started. Check the server log for completion',
      requestService: this.stockAdjustmentBackfillService,
      isLoading: this.stockAdjustmentBackfillService.isLoading
    },
    {
      fix: AdminDataFix.PURCHASE_MOVEMENT_CONTEXT_BACKFILL,
      title: 'Purchase Stock Movement Links',
      description: 'Stock received from deliveries before movements recorded their purchase need that link filled ' +
        'in every location. This adds the purchase reference to those received-stock movements and leaves movements ' +
        'that already have one untouched, so it is safe to run again. It runs in the background; completion is ' +
        'written to the server log.',
      buttonLabel: 'Backfill Purchase Links',
      successDetail: 'Backfill started. Check the server log for completion',
      requestService: this.purchaseMovementContextBackfillService,
      isLoading: this.purchaseMovementContextBackfillService.isLoading
    },
    {
      fix: AdminDataFix.LAST_PURCHASE_COST_BACKFILL,
      title: 'Last Purchase Costs',
      description: 'The last purchase cost of a product used to be stored in whichever unit the delivery was typed ' +
        'in. It is now stored per base unit, so costs of deliveries in different units compare. This recomputes ' +
        'it in every location from the latest received delivery of each product and leaves products with no ' +
        'delivery untouched, so it is safe to run again. It runs in the background; completion is written to ' +
        'the server log.',
      buttonLabel: 'Backfill Last Purchase Costs',
      successDetail: 'Backfill started. Check the server log for completion',
      requestService: this.lastPurchaseCostBackfillService,
      isLoading: this.lastPurchaseCostBackfillService.isLoading
    }
  ]

  runAdminDataFix(adminDataFixItem: AdminDataFixItem) {
    adminDataFixItem.requestService.run({
      onSuccess: () => this.messageService.add({
        summary: 'Success',
        detail: adminDataFixItem.successDetail,
        severity: 'success'
      }),
      onFail: (_) => this.messageService.add({
        summary: 'Error',
        detail: 'Request failed',
        severity: 'error'
      })
    })
  }
}
