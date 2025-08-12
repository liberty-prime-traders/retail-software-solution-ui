import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../base-api/base.store'
import {DbMigration} from './db-migration.model'

@Injectable({providedIn: 'root'})
export class DbMigrationStore extends createBaseStore<DbMigration>()
  implements BaseStore<DbMigration> {
  readonly basePath = 'db-migrations'
}
