import {Routes} from '@angular/router'
import {UnauthenticatedComponent} from '../lib/components/auth/unauthenticated.component'
import {LocationDashboardComponent} from '../lib/components/location-level/location-dashboard.component'
import {OrganizationDashboardComponent} from '../lib/components/organization-level/organization-dashboard.component'
import {
  CreateOrganizationComponent
} from '../lib/components/platform-level/create-organization/create-organization.component'
import {LandingComponent} from '../lib/components/platform-level/landing/landing.component'
import {ManagePlatformComponent} from '../lib/components/platform-level/manage-platform/manage-platform.component'
import {MyJoinRequestsComponent} from '../lib/components/platform-level/my-join-request/my-join-request.component'
import {PublicComponent} from '../lib/components/public/public.component'
import {CanViewLocation} from './route-guards/can-view-location'
import {CanViewOrganization} from './route-guards/can-view-organization'
import {CanViewPlatformOrganization} from './route-guards/can-view-platform.guard'
import {AuthenticatedGuard} from './route-guards/is-authenticated'
import {locationRoutes} from './routes/location-level.routes'
import {orgManagementRoutes} from './routes/org-level.routes'
import {platformManagementRoutes} from './routes/platform-level.routes'

const secureRoutes: Routes = [
  {path: '', component: LandingComponent, pathMatch: 'full'},
  {path: 'create-organization', component: CreateOrganizationComponent},
  {path: 'my-join-requests', component: MyJoinRequestsComponent},
  {
    path: 'manage-organization',
    component: OrganizationDashboardComponent,
    canActivate: [CanViewOrganization],
    children: orgManagementRoutes
  },
  {
    path: 'manage-platform',
    component: ManagePlatformComponent,
    canActivate: [CanViewPlatformOrganization],
    children: platformManagementRoutes
  },
  {
    path: 'location-dashboard',
    component: LocationDashboardComponent,
    canActivate: [CanViewLocation],
    children: locationRoutes
  }
]

export const SECURE_ROUTE = 'secure'
export const LOGGED_OUT_ROUTE = 'logged-out'

const appChildRoutes: Routes = [
  {path: LOGGED_OUT_ROUTE, component: UnauthenticatedComponent},
  {
    path: SECURE_ROUTE,
    canActivate: [AuthenticatedGuard],
    canActivateChild: [AuthenticatedGuard],
    children: secureRoutes
  },
  {path: '', component: PublicComponent, pathMatch: 'full'}
]

export const appRoutes: Routes = [
  {path: '', children: appChildRoutes},
  {path: '**', redirectTo: ''}
]
