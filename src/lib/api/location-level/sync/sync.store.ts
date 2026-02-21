import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {SyncLog} from './sync.model'

@Injectable({providedIn: 'root'})
export class SyncStore extends createBaseStore<SyncLog>()
  implements BaseStore<SyncLog> {
  readonly basePath = 'sync'
}
