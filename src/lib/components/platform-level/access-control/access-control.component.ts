import {Component, signal} from '@angular/core'
import {Button} from 'primeng/button'
import {TableModule} from 'primeng/table'
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
    Button
  ]
})
export class AccessControlComponent {

  readonly showAuthorityAssignmentScreen = signal(false)
  readonly SchemaLevel = SchemaLevel

  cancelAuthorityAssignment() {
    this.showAuthorityAssignmentScreen.set(false)
  }

  openAuthorityAssignment() {
    this.showAuthorityAssignmentScreen.set(true)
  }
}
