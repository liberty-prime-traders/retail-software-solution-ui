import {Injectable} from '@angular/core'
import {BaseService} from '../base-api/base.service'
import {DbVersion} from './db-version.model'
import {DbVersionStore} from './db-version.store'
import {DbVersionInsertDto} from './db-version-insert.dto'

@Injectable({providedIn: 'root'})
export class DbVersionService extends BaseService<DbVersion, DbVersionInsertDto> {
  constructor(protected override readonly store: DbVersionStore) {
    super(store)
  }

  activateVersion(versionId: string) {
    this.patchApiRequestConfig({upsertOnSuccess: true, urlSuffix: `${versionId}/activate`})
    return this.post()
  }
}
