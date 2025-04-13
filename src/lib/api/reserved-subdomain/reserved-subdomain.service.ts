import {Injectable} from '@angular/core'
import {BaseService} from '../base-api/base.service'
import {ReservedSubdomain} from './reserved-subdomain.model'
import {ReservedSubdomainState} from './reserved-subdomain.state'
import {ReservedSubdomainStore} from './reserved-subdomain.store'
import {ReservedSubdomainQuery} from './reserved-subdomain.query'

@Injectable({providedIn: 'root'})
export class ReservedSubdomainService extends BaseService<ReservedSubdomain, ReservedSubdomainState> {
  constructor(protected override readonly store: ReservedSubdomainStore,
              protected override readonly query: ReservedSubdomainQuery) {
    super(store, query)
  }
}
