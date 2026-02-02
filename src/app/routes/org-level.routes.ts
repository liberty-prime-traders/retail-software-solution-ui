import {Routes} from '@angular/router'
import {ContactComponent} from '../../lib/components/organization-level/contact/contact.component'
import {JobTitleComponent} from '../../lib/components/organization-level/job-title/job-title.component'
import {ProductCategoryComponent} from '../../lib/components/organization-level/product-category/product-category.component'
import {
  EndUserJoinRequestComponent
} from '../../lib/components/organization-level/end-user-join-request/end-user-join-request.component'
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
import {
  OrganizationProductComponent
} from '../../lib/components/organization-level/products/organization-product.component'
import {TagComponent} from '../../lib/components/organization-level/tag/tag.component'
import {UnitTreeComponent} from '../../lib/components/organization-level/units/unit-tree.component'

export const orgManagementRoutes: Routes = [
  {path: 'summary', component: OrganizationSummaryComponent},
  {path: 'product-category', component: ProductCategoryComponent},
  {path: 'job-title', component: JobTitleComponent},
  {path: 'units', component: UnitTreeComponent},
  {path: 'products', component: OrganizationProductComponent},
  {path: 'product-groups', component: ProductGroupComponent},
  {path: 'payment-options', component: PaymentOptionComponent},
  {path: 'tags', component: TagComponent},
  {path: 'contacts', component: ContactComponent},

  {path: 'locations', component: LocationsComponent},
  {path: 'profile', component: OrganizationProfileComponent},
  {path: 'admins', component: OrganizationAdminComponent},
  {path: 'join-requests', component: EndUserJoinRequestComponent},
  {path: 'users', component: OrganizationUserComponent},
  {path: '', redirectTo: 'summary', pathMatch: 'full'}
]
