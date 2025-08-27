import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {OrganizationMigrationModel} from './organization-migration.model'

@Injectable({providedIn: 'root'})
export class DbMigrationStore extends createBaseStore<OrganizationMigrationModel>()
  implements BaseStore<OrganizationMigrationModel> {
  readonly basePath = 'db-migrations'
}
