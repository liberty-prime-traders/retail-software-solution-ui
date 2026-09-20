import {HttpParams} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {SchemaLevel} from '../../platform-level/table-registry/schema-level.enum'
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

  override refetch(schemaLevel: SchemaLevel) {
    const urlSuffix = schemaLevel.toLowerCase()
    this.patchApiRequestConfig({urlSuffix})
    return super.refetch(schemaLevel)
  }

  override forceRefetch(schemaLevel: SchemaLevel) {
    const urlSuffix = schemaLevel.toLowerCase()
    this.patchApiRequestConfig({urlSuffix})
    return super.forceRefetch(schemaLevel)
  }
}
