import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../../util/base-api/base.store'
import {StandalonePermission} from './standalone-permission.model'

@Injectable({ providedIn: 'root' })
export class StandalonePermissionStore extends createBaseStore<StandalonePermission>((entity) => entity.permission)
  implements BaseStore<StandalonePermission> {

  readonly basePath = 'authorities/per-role'
}
