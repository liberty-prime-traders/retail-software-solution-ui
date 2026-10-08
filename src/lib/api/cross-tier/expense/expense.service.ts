import {Injectable} from '@angular/core'
import {ApiCallbacks} from '../../util/base-api/api-callbacks'
import {BaseService} from '../../util/base-api/base.service'
import {Expense, StandaloneExpenseBatchRequest, WageExpenseBatchRequest} from './expense.model'
import {ExpenseStore} from './expense.store'


@Injectable({providedIn: 'root'})
export class ExpenseService extends BaseService<Expense> {
  constructor(protected override readonly store: ExpenseStore) {
    super(store)
  }

  fetchRecent() {
    this.patchApiRequestConfig({urlSuffix: 'recent'})
    return this.refetch()
  }

  createStandalone(dto: StandaloneExpenseBatchRequest, callbacks?: ApiCallbacks<Expense>) {
    this.patchApiRequestConfig({urlSuffix: 'standalone', upsertOnSuccess: true})
    return this.post(dto as any, callbacks)
  }

  createWages(dto: WageExpenseBatchRequest, callbacks?: ApiCallbacks<Expense>) {
    this.patchApiRequestConfig({urlSuffix: 'wages', upsertOnSuccess: true})
    return this.post(dto as any, callbacks)
  }
}
