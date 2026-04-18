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
    this.patchApiRequestConfig({urlSuffix: 'root'})
    this.post(body, callbacks)
  }

  createChild(body: Partial<Account>, callbacks?: ApiCallbacks<Account>) {
    this.patchApiRequestConfig({urlSuffix: 'child'})
    this.post(body, callbacks)
  }

  deactivate(id: EntityId) {
    this.patchApiRequestConfig({urlSuffix: 'deactivate'})
    this.putRequest({id})
  }

  activate(id: EntityId) {
    this.patchApiRequestConfig({urlSuffix: 'activate'})
    this.putRequest({id})
  }
}
