import {Injectable} from '@angular/core'
import {BaseQuery} from '../base-api/base.query'
import {Organization} from './organization.model'
import {OrganizationState} from './organization.state'
import {OrganizationStore} from './organization.store'

@Injectable({providedIn: 'root'})
export class OrganizationQuery extends BaseQuery<Organization, OrganizationState> {
    constructor(protected override readonly store: OrganizationStore) {
        super(store)
    }
}
