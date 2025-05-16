import {Routes} from '@angular/router'
import {OktaAuthGuard, OktaCallbackComponent} from '@okta/okta-angular'
import {CategoryComponent} from '../lib/components/organization-level/category/category.component'
import {LocationSummaryComponent} from '../lib/components/location-level/location-summary/location-summary.component'
import {JobTitleComponent} from '../lib/components/organization-level/jobtitle/jobtitle.component'
import {LocationDashboardComponent} from '../lib/components/location-level/location-dashboard.component'
import {
  OrganizationSummaryComponent
} from '../lib/components/organization-level/organization-summary/organization-summary.component'
import {PaymentOptionComponent} from '../lib/components/organization-level/payment-option/payment-option.component'
import {UnitTreeComponent} from '../lib/components/organization-level/unit-tree/unit-tree.component'
import {CreateOrganizationComponent} from '../lib/components/platform-level/create-organization/create-organization.component'
import {LandingComponent} from '../lib/components/platform-level/landing/landing.component'
import {LocationsComponent} from '../lib/components/organization-level/locations/locations.component'
import {OrganizationDashboardComponent} from '../lib/components/organization-level/organization-dashboard.component'
import {
  OrganizationAdminComponent
} from '../lib/components/organization-level/organization-admin/organization-admin.component'
import {
  OrganizationProfileComponent
} from '../lib/components/organization-level/organization-profile/organization-profile.component'
import {SelectLocationComponent} from '../lib/components/platform-level/select-location/select-location.component'
import {PublicComponent} from '../lib/components/public/public.component'
import {CanViewLocation} from './route-guards/can-view-location'
import {CanViewOrganization} from './route-guards/can-view-organization'

const orgManagementChildRoutes: Routes = [
  {path: 'summary', component: OrganizationSummaryComponent},
  {path: 'category', component: CategoryComponent},
  {path: 'job-title', component: JobTitleComponent},
  {path: 'units', component: UnitTreeComponent},
  {path: 'payment-options', component: PaymentOptionComponent},
  
  {path: 'locations', component: LocationsComponent},
  {path: 'profile', component: OrganizationProfileComponent},
  {path: 'admins', component: OrganizationAdminComponent},
  {path: '', redirectTo: 'summary', pathMatch: 'full'}
]

const locationRoutes: Routes = [
  {path: '', component: LocationSummaryComponent},
]

const secureRoutes: Routes = [
  {path: '', component: LandingComponent, pathMatch: 'full'},
  {path: 'create-organization', component: CreateOrganizationComponent},
  {path: 'select-location', component: SelectLocationComponent, canActivate: [CanViewOrganization]},
  {
    path: 'manage-organization',
    component: OrganizationDashboardComponent,
    canActivate: [CanViewOrganization],
    children: orgManagementChildRoutes
  },
  {
    path: 'location-dashboard',
    component: LocationDashboardComponent,
    canActivate: [CanViewLocation],
    children: locationRoutes
  }
]

const appChildRoutes: Routes = [
  {path: 'login/callback', component: OktaCallbackComponent},
  {path: 'secure', canActivate: [OktaAuthGuard], children: secureRoutes},
  {path: '', component: PublicComponent, pathMatch: 'full'}
]

export const appRoutes: Routes = [
  {
    path: '',
    children: appChildRoutes
  },
  {path: '**', redirectTo: ''}
]
