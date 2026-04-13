import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {AccountsTreesForSelection} from './account-trees.model'

@Injectable({providedIn: 'root'})
export class AccountTreesStore extends createBaseStore<AccountsTreesForSelection>()
  implements BaseStore<AccountsTreesForSelection> {

  readonly basePath = 'accounts/selection-trees'
}
