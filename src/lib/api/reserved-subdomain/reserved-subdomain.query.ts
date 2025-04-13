import {Injectable} from '@angular/core'
import {BaseQuery} from '../base-api/base.query'
import {ReservedSubdomain } from './reserved-subdomain.model'
import {ReservedSubdomainStore} from './reserved-subdomain.store'
import {ReservedSubdomainState} from './reserved-subdomain.state'

@Injectable({providedIn: 'root'})
export class ReservedSubdomainQuery extends BaseQuery<ReservedSubdomain, ReservedSubdomainState> {
  constructor(protected override readonly store: ReservedSubdomainStore) {
    super(store)
  }
}
