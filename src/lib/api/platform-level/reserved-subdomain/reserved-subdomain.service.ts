import {HttpParams} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {BaseService} from '../../util/base-api/base.service'
import {ReservedSubdomain} from './reserved-subdomain.model'
import {ReservedSubdomainStore} from './reserved-subdomain.store'

@Injectable({providedIn: 'root'})
export class ReservedSubdomainService extends BaseService<ReservedSubdomain> {
  constructor(protected override readonly store: ReservedSubdomainStore) {
    super(store)
  }

  override getHttpParams(params: {suggestedSubdomain: string}): HttpParams {
    return new HttpParams().setNonNull('suggestedSubdomain', params?.suggestedSubdomain)
  }

  verifySubdomainAvailability(suggestedSubdomain: string) {
    this.patchApiRequestConfig({urlSuffix: 'verify'})
    return this.refetch({suggestedSubdomain})
  }
}
