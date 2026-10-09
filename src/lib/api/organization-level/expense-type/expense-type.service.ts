import {computed, Injectable} from '@angular/core'
import {ExpenseSourceType} from '../../cross-tier/expense/expense-source-type.enum'
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

  private eligibleFor(sourceType: ExpenseSourceType) {
    return this.selectAll().filter(expenseType => expenseType.eligibleSourceTypes.includes(sourceType))
  }
}
