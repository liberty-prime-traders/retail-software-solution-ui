import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {Account} from './account.model'

@Injectable({providedIn: 'root'})
export class AccountStore extends createBaseStore<Account>() implements BaseStore<Account> {
  readonly basePath = 'accounts'
}
