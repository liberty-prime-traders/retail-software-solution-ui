import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../base-api/base.store'
import {MigrationHistory} from './db-migration-history.model'

@Injectable({providedIn: 'root'})
export class DbMigrationHistoryStore extends createBaseStore<MigrationHistory>()
  implements BaseStore<MigrationHistory> {
  readonly basePath = 'db-migrations'
}
