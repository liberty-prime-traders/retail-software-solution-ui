import {Component} from '@angular/core'
import {MembershipUserService} from '../../../api/cross-tier/authorization/membership-user.service'
import {UserAccessDetailService} from '../../../api/cross-tier/authorization/user-access-detail.service'
import {OrgUserAccessDetailService} from '../../../api/organization-level/authorization/org-user-access-detail.service'
import {OrgMembershipUserService} from '../../../api/organization-level/membership/org-membership-user.service'
import {SchemaLevel} from '../../../api/platform-level/table-registry/schema-level.enum'
import {UserManagementComponent} from '../../cross-tier/user-management/user-management.component'

@Component({
  selector: 'rts-organization-user',
  templateUrl: 'organization-user.component.html',
  imports: [
    UserManagementComponent
  ],
  providers: [
    {provide: MembershipUserService, useExisting: OrgMembershipUserService},
    {provide: UserAccessDetailService, useExisting: OrgUserAccessDetailService}
  ]
})
export class OrganizationUserComponent {
  readonly SchemaLevel = SchemaLevel
}
