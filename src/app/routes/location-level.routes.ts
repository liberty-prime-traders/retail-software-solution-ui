import {Routes} from '@angular/router'
import {
  DailyBusinessSummaryComponent
} from '../../lib/components/cross-tier/daily-business-summary/daily-business-summary.component'
import {
  LocationProductComponent
} from '../../lib/components/location-level/location-products/location-product.component'
import {LocationSummaryComponent} from '../../lib/components/location-level/location-summary/location-summary.component'
import {LocationUserComponent} from '../../lib/components/location-level/location-user/location-user.component'
import {ExpensesComponent} from '../../lib/components/location-level/expenses/expenses.component'
import {
  ProductSalesCompareComponent
} from '../../lib/components/location-level/reports/product-sales-report/product-compare/product-sales-compare.component'
import {
  ProductSalesDetailComponent
} from '../../lib/components/location-level/reports/product-sales-report/product-detail/product-sales-detail.component'
import {
  ProductSalesReportComponent
} from '../../lib/components/location-level/reports/product-sales-report/product-report/product-sales-report.component'
import {BulkPaymentComponent} from '../../lib/components/location-level/purchase-bulk-payments/bulk-payment.component'
import {PurchaseComponent} from '../../lib/components/location-level/purchases/purchase.component'
import {
  ProductPurchasesReportComponent
} from '../../lib/components/location-level/reports/product-purchases-report/product-purchases-report.component'
import {PaymentsComponent} from '../../lib/components/location-level/reports/payments/payments.component'
import {SalesComponent} from '../../lib/components/location-level/sales/sales.component'
import {StockAdjustmentComponent} from '../../lib/components/location-level/stock-adjustment/stock-adjustment.component'
import {StockTransferComponent} from '../../lib/components/location-level/stock-transfer/stock-transfer.component'
import {SyncComponent} from '../../lib/components/location-level/sync/sync.component'
import {TaxesComponent} from '../../lib/components/location-level/taxes/taxes.component'

export const locationRoutes: Routes = [
  {path: '', component: LocationSummaryComponent},
  {path: 'daily-summary', component: DailyBusinessSummaryComponent},
  {path: 'products', component: LocationProductComponent},
  {path: 'purchases', component: PurchaseComponent},
  {path: 'purchases-bulk-payment', component: BulkPaymentComponent},
  {path: 'sync', component: SyncComponent},
  {path: 'sales', component: SalesComponent},
  {path: 'stock-transfer', component: StockTransferComponent},
  {path: 'stock-adjustments', component: StockAdjustmentComponent},
  {path: 'taxes', component: TaxesComponent},
  {path: 'expenses', component: ExpensesComponent},
  {path: 'users', component: LocationUserComponent},
  {path: 'reports/product-purchases', component: ProductPurchasesReportComponent},
  {path: 'reports/payments', component: PaymentsComponent},
  {
    path: 'reports/product-sales',
    children: [
      {path: '', component: ProductSalesReportComponent},
      {path: 'compare', component: ProductSalesCompareComponent},
      {path: 'detail', component: ProductSalesDetailComponent}
    ]
  }
]
