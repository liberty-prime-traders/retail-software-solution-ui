import {Injectable} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {ApiCallbacks} from '../../util/base-api/api-callbacks'
import {BaseService} from '../../util/base-api/base.service'
import {Account} from './account.model'
import {AccountStore} from './account.store'

@Injectable({providedIn: 'root'})
export class AccountService extends BaseService<Account> {
  constructor(protected override readonly store: AccountStore) {
    super(store)
  }

  createRoot(body: Partial<Account>, callbacks?: ApiCallbacks<Account>) {
    this.postRequest({body, callbacks, config: {urlSuffix: 'root'}})
  }

  createChild(body: Partial<Account>, callbacks?: ApiCallbacks<Account>) {
    this.postRequest({body, callbacks, config: {urlSuffix: 'child'}})
  }

  deactivate(id: EntityId) {
    this.putRequest({id, config: {urlSuffix: 'deactivate'}})
  }

  activate(id: EntityId) {
    this.putRequest({id, config: {urlSuffix: 'activate'}})
  }
}
