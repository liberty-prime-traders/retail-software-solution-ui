import {Routes} from '@angular/router'
import {CategoryComponent} from '../../lib/components/organization-level/category/category.component'
import {
  EndUserJoinRequestComponent
} from '../../lib/components/organization-level/end-user-join-request/end-user-join-request.component'
import {JobTitleComponent} from '../../lib/components/organization-level/jobtitle/jobtitle.component'
import {LocationsComponent} from '../../lib/components/organization-level/locations/locations.component'
import {
  OrganizationAdminComponent
} from '../../lib/components/organization-level/organization-admin/organization-admin.component'
import {
  OrganizationProfileComponent
} from '../../lib/components/organization-level/organization-profile/organization-profile.component'
import {
  OrganizationSummaryComponent
} from '../../lib/components/organization-level/organization-summary/organization-summary.component'
import {
  OrganizationUserComponent
} from '../../lib/components/organization-level/organization-user/organization-user.component'
import {PaymentOptionComponent} from '../../lib/components/organization-level/payment-option/payment-option.component'
import {ProductGroupComponent} from '../../lib/components/organization-level/product-group/product-group.component'
import {ProductComponent} from '../../lib/components/organization-level/products/product.component'
import {TagComponent} from '../../lib/components/organization-level/tag/tag.component'
import {UnitTreeComponent} from '../../lib/components/organization-level/units/unit-tree.component'

export const orgManagementRoutes: Routes = [
  {path: 'summary', component: OrganizationSummaryComponent},
  {path: 'category', component: CategoryComponent},
  {path: 'job-title', component: JobTitleComponent},
  {path: 'units', component: UnitTreeComponent},
  {path: 'products', component: ProductComponent},
  {path: 'product-groups', component: ProductGroupComponent},
  {path: 'payment-options', component: PaymentOptionComponent},
  {path: 'tags', component: TagComponent},

  {path: 'locations', component: LocationsComponent},
  {path: 'profile', component: OrganizationProfileComponent},
  {path: 'admins', component: OrganizationAdminComponent},
  {path: 'join-requests', component: EndUserJoinRequestComponent},
  {path: 'users', component: OrganizationUserComponent},
  {path: '', redirectTo: 'summary', pathMatch: 'full'}
]
