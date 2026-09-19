import {Component, signal} from '@angular/core'
import {Button} from 'primeng/button'
import {SchemaLevel} from '../../../api/platform-level/table-registry/schema-level.enum'
import {AuthorityAssignmentComponent} from '../../cross-tier/authority-assignment/authority-assignment.component'
import {AutoStretchDirective} from '../../reusable/auto-stretch.directive'
import {OrganizationMembershipComponent} from './organization-membership.component'

@Component({
  selector: 'rts-organization-user',
  templateUrl: 'organization-user.component.html',
  imports: [
    AuthorityAssignmentComponent,
    OrganizationMembershipComponent,
    Button,
    AutoStretchDirective
  ]
})
export class OrganizationUserComponent {

  readonly showAuthorityAssignmentScreen = signal(false)
  readonly SchemaLevel = SchemaLevel

  cancelAuthorityAssignment() {
    this.showAuthorityAssignmentScreen.set(false)
  }

  openAuthorityAssignment() {
    this.showAuthorityAssignmentScreen.set(true)
  }
}
