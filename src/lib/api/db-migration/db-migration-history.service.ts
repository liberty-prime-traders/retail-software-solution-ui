import {Injectable} from '@angular/core'
import {BaseService} from '../base-api/base.service'
import {MigrationHistory} from './db-migration-history.model'
import {DbMigrationHistoryStore} from './db-migration-history.store'

@Injectable({providedIn: 'root'})
export class DbMigrationHistoryService extends BaseService<MigrationHistory> {
  constructor(protected override readonly store: DbMigrationHistoryStore) {
    super(store)
  }

  getHistory(start: Date, end: Date) {
    this.patchApiRequestConfig({
      upsertOnSuccess: true,
      queryParams: {start: start.toISOString(), end: end.toISOString()}
    })
    return this.refetch()
  }
}
