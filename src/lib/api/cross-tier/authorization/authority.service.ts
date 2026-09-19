import {HttpParams} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {MultimapBaseService} from '../../util/base-api/multimap-base.service'
import {Authority} from './authority.model'
import {AuthorityStore} from './authority.store'

@Injectable({ providedIn: 'root' })
export class AuthorityService extends MultimapBaseService<Authority>{

  protected override keyPath: keyof Authority = 'tier'

  constructor(protected override readonly store: AuthorityStore) {
    super(store)
  }

  override appendHttpParams(httpParams: HttpParams): HttpParams {
    return httpParams
  }

  getForPlatform() {
    this.patchApiRequestConfig({urlSuffix: 'platform'})
    return this.doFetch()
  }

  getForOrganization() {
    this.patchApiRequestConfig({urlSuffix: 'organization'})
    return this.doFetch()
  }

  getForLocation() {
    this.patchApiRequestConfig({urlSuffix: 'location'})
    return this.doFetch()
  }

  doFetch() {
    return this.refetch( 'dummy')
  }
}
