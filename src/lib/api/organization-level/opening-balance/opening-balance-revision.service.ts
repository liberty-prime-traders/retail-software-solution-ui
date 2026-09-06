import {Injectable} from '@angular/core'
import {EntityId} from '@ngrx/signals/entities'
import {ApiCallbacks} from '../../util/base-api/api-callbacks'
import {MultimapBaseService} from '../../util/base-api/multimap-base.service'
import {OpeningBalanceRevision} from './opening-balance-revision.model'
import {OpeningBalanceRevisionStore} from './opening-balance-revision.store'

@Injectable({providedIn: 'root'})
export class OpeningBalanceRevisionService extends MultimapBaseService<OpeningBalanceRevision> {

  protected override keyPath: keyof OpeningBalanceRevision = 'accountCode'

  constructor(protected override readonly store: OpeningBalanceRevisionStore) {
    super(store)
  }

  getHistory(accountCode: EntityId | undefined) {
    this.patchApiRequestConfig({urlSuffix: `history`})
    return this.refetch(accountCode)
  }

  updateOpeningBalance(accountCode: string, newAmount: number, callbacks: ApiCallbacks<OpeningBalanceRevision>) {
    return this.postRequest({callbacks, body: {accountCode, newAmount} as any})
  }
}
