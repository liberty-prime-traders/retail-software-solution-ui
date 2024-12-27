import {Injectable} from '@angular/core'
import {BaseService} from '../base-api/base.service'
import {Organization} from './organization.model'
import {OrganizationQuery} from './organization.query'
import {OrganizationState} from './organization.state'
import {OrganizationStore} from './organization.store'

@Injectable({providedIn: 'root'})
export class OrganizationService extends BaseService<Organization, OrganizationState> {
	
	constructor(protected override readonly store: OrganizationStore,
	            protected override readonly query: OrganizationQuery) {
		super(store, query)
	}
}
