import {Injectable} from '@angular/core'
import {BaseService} from '../../util/base-api/base.service'
import {DbVersionInsertModel} from './db-version-insert.model'
import {DbVersion} from './db-version.model'
import {DbVersionStore} from './db-version.store'

@Injectable({providedIn: 'root'})
export class DbVersionService extends BaseService<DbVersion, DbVersionInsertModel> {
  constructor(protected override readonly store: DbVersionStore) {
    super(store)
  }

  activateVersion(versionId: string) {
    this.patchApiRequestConfig({urlSuffix: `activate`})
    return this.putRequest({id: versionId})
  }
}
