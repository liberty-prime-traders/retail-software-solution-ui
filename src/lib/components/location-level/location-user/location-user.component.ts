import {Component, signal} from '@angular/core'
import {Button} from 'primeng/button'
import {MembershipUserService} from '../../../api/cross-tier/authorization/membership-user.service'
import {UserAccessDetailService} from '../../../api/cross-tier/authorization/user-access-detail.service'
import {LocationUserAccessDetailService} from '../../../api/location-level/authorization/location-user-access-detail.service'
import {LocationMembershipUserService} from '../../../api/location-level/membership/location-membership-user.service'
import {SchemaLevel} from '../../../api/platform-level/table-registry/schema-level.enum'
import {UserManagementComponent} from '../../cross-tier/user-management/user-management.component'
import {PullFromOrgUserComponent} from './pull-from-org-user.component'

@Component({
  selector: 'rts-location-user',
  templateUrl: 'location-user.component.html',
  imports: [
    UserManagementComponent,
    PullFromOrgUserComponent,
    Button
  ],
  providers: [
    {provide: MembershipUserService, useExisting: LocationMembershipUserService},
    {provide: UserAccessDetailService, useExisting: LocationUserAccessDetailService}
  ]
})
export class LocationUserComponent {
  readonly SchemaLevel = SchemaLevel
  readonly showPullFromOrgScreen = signal(false)

  hidePullFromOrgScreen() {
    this.showPullFromOrgScreen.set(false)
  }

  openPullFromOrgScreen() {
    this.showPullFromOrgScreen.set(true)
  }
}
