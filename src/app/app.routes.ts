import {Routes} from '@angular/router'
import {OktaAuthGuard, OktaCallbackComponent} from '@okta/okta-angular'
import {HomepageComponent} from '../lib/components/private/homepage/homepage.component'
import {OrganizationTreeComponent} from '../lib/components/private/organization-tree/organization-tree.component'
import {PrivateComponent} from '../lib/components/private/private.component'
import {PublicComponent} from '../lib/components/public/public.component'
import {JobTitleComponent} from '../lib/components/private/jobtitle/jobtitle.component'
import {CategoryComponent} from '../lib/components/private/category/category.component'
import {UnitTreeComponent} from '../lib/components/private/unit-tree/unit-tree.component'
import {PaymentOptionComponent} from 'lib/components/private/payment-option/payment-option.component'
import {LandingComponent} from 'lib/components/private/landing/landing.component'
import {OrganizationDashboardComponent} from 'lib/components/private/organization-dashboard/organization-dashboard.component'
import {CreateOrganizationComponent} from 'lib/components/private/create-organization/create-organization.component'
import {SelectLocationComponent} from 'lib/components/private/select-location/select-location.component'
import {ManageOrganizationComponent} from 'lib/components/private/manage-organization/manage-organization.component'

const secureRoutes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'organization-tree', component: OrganizationTreeComponent},
  {path: 'category', component: CategoryComponent},
  {path: 'jobtitle', component: JobTitleComponent},
  {path: 'units', component: UnitTreeComponent},
  {path: 'payment-options', component: PaymentOptionComponent},
  {path: 'create-organization', component: CreateOrganizationComponent}
]

const landingChildRoutes: Routes = [
  {path: 'create-organization', component: CreateOrganizationComponent},
  {path: ':domain', component: OrganizationDashboardComponent,
    children: [
      {path: 'locations', component: SelectLocationComponent},
      {path: 'manage', component: ManageOrganizationComponent},
      { path: '', redirectTo: 'locations', pathMatch: 'full' }
    ]
  },
  {path: '', component: LandingComponent}
];

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
