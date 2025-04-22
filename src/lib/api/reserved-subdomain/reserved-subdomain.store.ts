import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../base-api/base.store'
import {ReservedSubdomain} from './reserved-subdomain.model'

@Injectable({providedIn: 'root'})
export class ReservedSubdomainStore extends createBaseStore<ReservedSubdomain>()
  implements BaseStore<ReservedSubdomain> {
  
  readonly basePath = 'reserved-subdomains'
}
