import {HttpParams} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {AuthorityType} from '../../cross-tier/authorization/authority.model'
import {FetchParams} from '../../util/base-api/api-get-request.model'
import {MultimapBaseService} from '../../util/base-api/multimap-base.service'
import {AuthorityHolder} from './authority-holder.model'
import {AuthorityHolderStore} from './authority-holder.store'

@Injectable({ providedIn: 'root' })
export class AuthorityHolderService extends MultimapBaseService<AuthorityHolder> {

  protected override keyPath: keyof AuthorityHolder = 'authorityName'

  constructor(protected override readonly store: AuthorityHolderStore) {
    super(store)
  }

  getPlatformAuthorityHolders(authorityName: string, authorityType: AuthorityType) {
    return this.refetch({authorityName, authorityType})
  }

  override appendHttpParams(httpParams: HttpParams, params: FetchParams): HttpParams {
    return super.appendHttpParams(httpParams, params.authorityName)
      .setNonNull('authorityType', params.authorityType)
  }
}
