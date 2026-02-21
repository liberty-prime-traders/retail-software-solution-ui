import {Routes} from '@angular/router'
import {
  LocationProductComponent
} from '../../lib/components/location-level/location-products/location-product.component'
import {LocationSummaryComponent} from '../../lib/components/location-level/location-summary/location-summary.component'
import {PurchaseComponent} from '../../lib/components/location-level/purchases/purchase.component'
import {SyncComponent} from '../../lib/components/location-level/sync/sync.component'

export const locationRoutes: Routes = [
  {path: '', component: LocationSummaryComponent},
  {path: 'products', component: LocationProductComponent},
  {path: 'purchases', component: PurchaseComponent},
  {path: 'sync', component: SyncComponent}
]
