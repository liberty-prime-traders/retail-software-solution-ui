import {HttpParams} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {BaseService} from '../base-api/base.service'
import {ReservedSubdomain} from './reserved-subdomain.model'
import {ReservedSubdomainStore} from './reserved-subdomain.store'

@Injectable({providedIn: 'root'})
export class ReservedSubdomainService extends BaseService<ReservedSubdomain> {
  constructor(protected override readonly store: ReservedSubdomainStore) {
    super(store)
  }

  override getHttpParams(suggestedSubdomain: string): HttpParams {
    return new HttpParams().setNonNull('suggestedSubdomain', suggestedSubdomain)
  }
}
