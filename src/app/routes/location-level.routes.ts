import {Routes} from '@angular/router'
import {
  LocationProductComponent
} from '../../lib/components/location-level/location-products/location-product.component'
import {LocationSummaryComponent} from '../../lib/components/location-level/location-summary/location-summary.component'
import {PurchaseComponent} from '../../lib/components/location-level/purchases/purchase.component'
import {SaleGridComponent} from '../../lib/components/location-level/sales/sales-grid/sale-grid.component'
import {StockTransferComponent} from '../../lib/components/location-level/stock-transfer/stock-transfer.component'
import {SyncComponent} from '../../lib/components/location-level/sync/sync.component'

export const locationRoutes: Routes = [
  {path: '', component: LocationSummaryComponent},
  {path: 'products', component: LocationProductComponent},
  {path: 'purchases', component: PurchaseComponent},
  {path: 'sync', component: SyncComponent},
  {path: 'sales', component: SaleGridComponent},
  {path: 'stock-transfer', component: StockTransferComponent}
]
