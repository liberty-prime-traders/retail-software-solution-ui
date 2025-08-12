import {Injectable} from '@angular/core'
import {BaseService} from '../base-api/base.service'
import {DbMigrationStore} from './db-migration.store'
import {DbMigration} from './db-migration.model'
import {DbMigrationRequestDto} from './db-migration-request.dto'
import {DbMigrationRetryRequestDto} from './db-migration-retry-request.dto'

@Injectable({providedIn: 'root'})
export class DbMigrationService extends BaseService<DbMigration, DbMigrationRequestDto | DbMigrationRetryRequestDto> {
  constructor(protected override readonly store: DbMigrationStore) {
    super(store)
  }

  runMigration(request: DbMigrationRequestDto) {
    this.patchApiRequestConfig({upsertOnSuccess: true, urlSuffix: 'run'})
    return this.post(request)
  }

  retryFailedLocations(request: DbMigrationRetryRequestDto) {
    this.patchApiRequestConfig({upsertOnSuccess: true, urlSuffix: 'retry'})
    return this.post(request)
  }
}
