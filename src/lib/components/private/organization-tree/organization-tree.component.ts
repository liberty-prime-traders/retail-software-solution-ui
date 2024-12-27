import {Component} from '@angular/core'
import {OrganizationComponent} from './organization/organization.component'

@Component({
	standalone: true,
	selector: 'rts-organization-tree',
	templateUrl: 'organization-tree.component.html',
	imports: [
		OrganizationComponent
	]
})
export class OrganizationTreeComponent {

}
