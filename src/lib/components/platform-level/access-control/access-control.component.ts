import {Component, inject, signal} from '@angular/core'
import {ButtonDirective} from 'primeng/button'
import {TableModule} from 'primeng/table'
import {AuthorityService} from '../../../api/cross-tier/authorization/authority.service'
import {SchemaLevel} from '../../../api/platform-level/table-registry/schema-level.enum'
import {AuthorityAssignmentComponent} from '../../cross-tier/authority-assignment/authority-assignment.component'
import {PlatformAuthoritiesComponent} from './platform-authorities.component'

@Component({
  selector: 'rts-access-control',
  templateUrl: './access-control.component.html',
  imports: [
    TableModule,
    AuthorityAssignmentComponent,
    PlatformAuthoritiesComponent,
    ButtonDirective
  ]
})
export class AccessControlComponent {
  private readonly authorityService = inject(AuthorityService)

  readonly showAuthorityAssignmentScreen = signal(false)
  readonly SchemaLevel = SchemaLevel

  cancelAuthorityAssignment() {
    this.showAuthorityAssignmentScreen.set(false)
  }

  openAuthorityAssignment() {
    this.showAuthorityAssignmentScreen.set(true)
  }

  onAuthoritiesAssigned() {
    this.authorityService.refetch(SchemaLevel.PLATFORM)
    this.cancelAuthorityAssignment()
  }
}
