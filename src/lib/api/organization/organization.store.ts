import {Injectable} from '@angular/core'
import {StoreConfig} from '@datorama/akita'
import {createInitialState} from '../base-api/base.state'
import {BaseStore} from '../base-api/base.store'
import {Organization} from './organization.model'
import {OrganizationState} from './organization.state'

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'organizations'})
export class OrganizationStore extends BaseStore<Organization, OrganizationState> {
  constructor() {
    super(createInitialState())
  }
}
