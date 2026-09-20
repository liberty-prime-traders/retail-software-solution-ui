import {Component, inject, input, signal} from '@angular/core'
import {ButtonDirective} from 'primeng/button'
import {AuthorityAssignmentRequest} from '../../../api/cross-tier/authorization/authority.model'
import {UserAccessDetailService} from '../../../api/cross-tier/authorization/user-access-detail.service'
import {SchemaLevel} from '../../../api/platform-level/table-registry/schema-level.enum'
import {AutoStretchDirective} from '../../reusable/auto-stretch.directive'
import {AuthorityAssignmentComponent} from '../authority-assignment/authority-assignment.component'
import {MembershipComponent} from '../membership/membership.component'

@Component({
  selector: 'rts-user-management',
  templateUrl: 'user-management.component.html',
  imports: [
    AuthorityAssignmentComponent,
    MembershipComponent,
    ButtonDirective,
    AutoStretchDirective
  ]
})
export class UserManagementComponent {
  private readonly userAccessDetailService = inject(UserAccessDetailService)

  readonly schemaLevel = input.required<SchemaLevel>()
  readonly showAuthorityAssignmentScreen = signal(false)

  hideAuthorityAssignment() {
    this.showAuthorityAssignmentScreen.set(false)
  }

  openAuthorityAssignment() {
    this.showAuthorityAssignmentScreen.set(true)
  }

  onAuthoritiesAssigned(request: AuthorityAssignmentRequest) {
    request.userIds.forEach(userId => this.userAccessDetailService.forceRefetch(userId))
    this.hideAuthorityAssignment()
  }
}
