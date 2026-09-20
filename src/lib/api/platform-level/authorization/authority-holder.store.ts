import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {AuthorityHolder} from './authority-holder.model'

@Injectable({ providedIn: 'root' })
export class AuthorityHolderStore
  extends createBaseStore<AuthorityHolder>((entity) => `${entity.authorityName}-${entity.fullName}-${entity.grantedOn}`)
  implements BaseStore<AuthorityHolder> {

  readonly basePath = 'authorities/platform/holders'
}
