import {Routes} from '@angular/router'
import {OktaAuthGuard, OktaCallbackComponent} from '@okta/okta-angular'
import {CategoryComponent} from '../lib/components/location-dashboard/category/category.component'
import {HomepageComponent} from '../lib/components/location-dashboard/homepage/homepage.component'
import {JobTitleComponent} from '../lib/components/location-dashboard/jobtitle/jobtitle.component'
import {LocationDashboardComponent} from '../lib/components/location-dashboard/location-dashboard.component'
import {PaymentOptionComponent} from '../lib/components/location-dashboard/payment-option/payment-option.component'
import {UnitTreeComponent} from '../lib/components/location-dashboard/unit-tree/unit-tree.component'
import {CreateOrganizationComponent} from '../lib/components/platform/create-organization/create-organization.component'
import {LandingComponent} from '../lib/components/platform/landing/landing.component'
import {LocationsComponent} from '../lib/components/platform/manage-organization/locations/locations.component'
import {ManageOrganizationComponent} from '../lib/components/platform/manage-organization/manage-organization.component'
import {
  OrganizationAdminComponent
} from '../lib/components/platform/manage-organization/organization-admin/organization-admin.component'
import {
  UpdateOrganizationComponent
} from '../lib/components/platform/manage-organization/update-organization/update-organization.component'
import {SelectLocationComponent} from '../lib/components/platform/select-location/select-location.component'
import {PublicComponent} from '../lib/components/public/public.component'

const orgManagementChildRoutes: Routes = [
  {path: 'locations', component: LocationsComponent},
  {path: 'settings', component: UpdateOrganizationComponent},
  {path: 'admins', component: OrganizationAdminComponent},
  {path: '', redirectTo: 'locations', pathMatch: 'full'}
]

const locationRoutes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'category', component: CategoryComponent},
  {path: 'job-title', component: JobTitleComponent},
  {path: 'units', component: UnitTreeComponent},
  {path: 'payment-options', component: PaymentOptionComponent}
]

const platformRoutes: Routes = [
  {path: '', component: LandingComponent, pathMatch: 'full'},
  {path: 'create-organization', component: CreateOrganizationComponent},
  {path: 'select-location', component: SelectLocationComponent},
  {path: 'manage-organization', component: ManageOrganizationComponent, children: orgManagementChildRoutes},
]

const secureRoutes: Routes = [
  {path: 'location-dashboard', component: LocationDashboardComponent, children: locationRoutes},
  {path: '', children: platformRoutes},
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
