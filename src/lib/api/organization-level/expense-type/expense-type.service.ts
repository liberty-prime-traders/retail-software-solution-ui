import {computed, Injectable} from '@angular/core'
import {ExpenseSourceType} from '../../cross-tier/expense/expense-source-type.enum'
import {ApiCallbacks} from '../../util/base-api/api-callbacks'
import {BaseService} from '../../util/base-api/base.service'
import {ExpenseType} from './expense-type.model'
import {ExpenseTypeStore} from './expense-type.store'

@Injectable({providedIn: 'root'})
export class ExpenseTypeService extends BaseService<ExpenseType> {

  readonly forPurchase = computed(() => this.eligibleFor(ExpenseSourceType.PURCHASE))
  readonly forAdhoc = computed(() => this.eligibleFor(ExpenseSourceType.ADHOC))

  constructor(protected override readonly store: ExpenseTypeStore) {
    super(store)
  }

  rename(body: Pick<ExpenseType, 'id' | 'name'>, callbacks?: ApiCallbacks<ExpenseType>) {
    this.patchApiRequestConfig({urlSuffix: 'name'})
    this.putRequest({body, callbacks})
  }

  private eligibleFor(sourceType: ExpenseSourceType) {
    return this.selectAll().filter(expenseType => expenseType.eligibleSourceTypes.includes(sourceType))
  }
}
