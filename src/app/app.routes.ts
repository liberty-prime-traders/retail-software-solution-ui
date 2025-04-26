import {Routes} from '@angular/router'
import {OktaAuthGuard, OktaCallbackComponent} from '@okta/okta-angular'
import {HomepageComponent} from '../lib/components/private/homepage/homepage.component'
import {PrivateComponent} from '../lib/components/private/private.component'
import {PublicComponent} from '../lib/components/public/public.component'
import {JobTitleComponent} from '../lib/components/private/jobtitle/jobtitle.component'
import {CategoryComponent} from '../lib/components/private/category/category.component'
import {UnitTreeComponent} from '../lib/components/private/unit-tree/unit-tree.component'
import {PaymentOptionComponent} from 'lib/components/private/payment-option/payment-option.component'
import {LandingComponent} from 'lib/components/private/landing/landing.component'
import {OrganizationDashboardComponent} from '../lib/components/private/landing/organization-dashboard/organization-dashboard.component'
import {CreateOrganizationComponent} from '../lib/components/private/landing/create-organization/create-organization.component'
import {SelectLocationComponent} from '../lib/components/private/landing/organization-dashboard/select-location/select-location.component'
import {ManageOrganizationComponent} from '../lib/components/private/landing/organization-dashboard/manage-organization/manage-organization.component'
import {LocationComponent} from '../lib/components/private/landing/organization-dashboard/manage-organization/location/location.component'
import {OrganizationAdminComponent} from '../lib/components/private/landing/organization-dashboard/manage-organization/organization-admin/organization-admin.component'
import {UpdateOrganizationComponent} from '../lib/components/private/landing/organization-dashboard/manage-organization/update-organization/update-organization.component'

const secureRoutes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'category', component: CategoryComponent},
  {path: 'job-title', component: JobTitleComponent},
  {path: 'units', component: UnitTreeComponent},
  {path: 'payment-options', component: PaymentOptionComponent}
]

const orgManagementChildRoutes: Routes = [
  {path: 'locations', component: LocationComponent},
  {path: 'settings', component: UpdateOrganizationComponent},
  {path: 'admins', component: OrganizationAdminComponent},
  {path: '', redirectTo: 'locations', pathMatch: 'full'}
]

const landingChildRoutes: Routes = [
  {path: 'create-organization', component: CreateOrganizationComponent},
  {path: ':subdomain',
    component: OrganizationDashboardComponent,
    children: [
      {path: 'select-location', component: SelectLocationComponent},
      {path: 'manage', component: ManageOrganizationComponent, children: orgManagementChildRoutes},
      {path: '', redirectTo: 'select-location', pathMatch: 'full'}
    ]},
  {path: '', component: LandingComponent}
]

const appChildRoutes: Routes = [
  {path: 'login/callback', component: OktaCallbackComponent},
  {path: 'landing', canActivate: [OktaAuthGuard], children: landingChildRoutes},
  {path: 'secure', canActivate: [OktaAuthGuard], component: PrivateComponent, children: secureRoutes},
  {path: '', component: PublicComponent, pathMatch: 'full'}
]

export const appRoutes: Routes = [
  {
    path: '',
    children: appChildRoutes
  },
  {path: '**', redirectTo: ''}
]
