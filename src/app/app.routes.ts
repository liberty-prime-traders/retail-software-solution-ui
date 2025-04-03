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

const secureRoutes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'organization-tree', component: OrganizationTreeComponent},
  {path: 'category', component: CategoryComponent},
  {path: 'jobtitle', component: JobTitleComponent},
  {path: 'units', component: UnitTreeComponent},
  {path: 'payment-options', component: PaymentOptionComponent}
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
