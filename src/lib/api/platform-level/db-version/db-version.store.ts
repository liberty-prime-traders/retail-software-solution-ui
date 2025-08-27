import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {DbVersion} from './db-version.model'

@Injectable({providedIn: 'root'})
export class DbVersionStore extends createBaseStore<DbVersion>()
  implements BaseStore<DbVersion> {
  readonly basePath = 'db-versions'
}
