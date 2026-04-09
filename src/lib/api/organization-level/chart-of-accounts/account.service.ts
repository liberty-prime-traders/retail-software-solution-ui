import {Injectable} from '@angular/core'
import {BaseService} from '../../util/base-api/base.service'
import {Account} from './account.model'
import {AccountStore} from './account.store'

@Injectable({providedIn: 'root'})
export class AccountService extends BaseService<Account> {
  constructor(protected override readonly store: AccountStore) {
    super(store)
  }
}
