import {Injectable} from '@angular/core'
import {StoreConfig} from '@datorama/akita'
import {BaseStore} from '../base-api/base.store'
import {createInitialState} from '../base-api/base.state'
import {ReservedSubdomain} from './reserved-subdomain.model'
import {ReservedSubdomainState} from './reserved-subdomain.state'

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'reserved-subdomains'})
export class ReservedSubdomainStore extends BaseStore<ReservedSubdomain, ReservedSubdomainState> {
  constructor() {
    super(createInitialState())
  }
}
