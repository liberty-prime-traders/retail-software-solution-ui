import {Routes} from '@angular/router'
import {OktaAuthGuard, OktaCallbackComponent} from '@okta/okta-angular'
import {HomepageComponent} from '../lib/components/private/homepage/homepage.component'
import {OrganizationTreeComponent} from '../lib/components/private/organization-tree/organization-tree.component'
import {PrivateComponent} from '../lib/components/private/private.component'
import {PublicComponent} from '../lib/components/public/public.component'

const secureRoutes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'organization-tree', component: OrganizationTreeComponent}
]

const appChildRoutes: Routes = [
  {path: 'login/callback', component: OktaCallbackComponent},
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
