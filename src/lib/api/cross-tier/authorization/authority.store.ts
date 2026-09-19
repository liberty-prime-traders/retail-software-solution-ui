import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {Authority} from './authority.model'

@Injectable({ providedIn: 'root' })
export class AuthorityStore extends createBaseStore<Authority>((entity) => entity.name)
  implements BaseStore<Authority> {

  readonly basePath = 'authorities'
}
