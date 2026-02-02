import {Routes} from '@angular/router'
import {
  LocationProductComponent
} from '../../lib/components/location-level/location-products/location-product.component'
import {LocationSummaryComponent} from '../../lib/components/location-level/location-summary/location-summary.component'

export const locationRoutes: Routes = [
  {path: '', component: LocationSummaryComponent},
  {path: 'products', component: LocationProductComponent}
]
