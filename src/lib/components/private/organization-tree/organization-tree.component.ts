import {Component, signal} from '@angular/core'
import {Panel} from 'primeng/panel'
import {Location} from '../../../api/location/location.model'
import {Organization} from '../../../api/organization/organization.model'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {LocationComponent} from './location/location.component'
import {OrganizationComponent} from './organization/organization.component'
import {UserLocationComponent} from './user-location/user-location.component'

@Component({
  standalone: true,
  selector: 'rts-organization-tree',
  templateUrl: 'organization-tree.component.html',
  imports: [
    OrganizationComponent,
    NullSafePipe,
    LocationComponent,
    UserLocationComponent,
    Panel
  ]
})
export class OrganizationTreeComponent {
  readonly selectedOrganization = signal<Organization| undefined>(undefined)
  readonly selectedLocation = signal<Location| undefined>(undefined)
  
  organizationChange(organization?: Organization) {
    this.selectedOrganization.set(organization)
    this.selectedLocation.set(undefined)
  }
}
