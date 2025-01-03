import {Component, signal} from '@angular/core'
import {Organization} from '../../../api/organization/organization.model'
import {NullSafePipe} from '../../../utils/pipes/null-safe.pipe'
import {LocationComponent} from './location/location.component'
import {OrganizationComponent} from './organization/organization.component'

@Component({
  standalone: true,
  selector: 'rts-organization-tree',
  templateUrl: 'organization-tree.component.html',
  imports: [
    OrganizationComponent,
    NullSafePipe,
    LocationComponent
  ]
})
export class OrganizationTreeComponent {
  readonly selectedOrganization = signal<Organization| undefined>(undefined)
}
