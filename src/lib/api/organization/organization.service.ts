import {Injectable} from '@angular/core'
import {BaseService} from '../base-api/base.service'
import {Organization} from './organization.model'
import {OrganizationStore} from './organization.store'

@Injectable({providedIn: 'root'})
export class OrganizationService extends BaseService<Organization> {
  constructor(protected override readonly store: OrganizationStore) {
    super(store)
  }
}
