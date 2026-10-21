import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {DailyBalances} from './daily-balances.model'

@Injectable({providedIn: 'root'})
export class DailyBalancesStore
  extends createBaseStore<DailyBalances>(() => 'daily-balances')
  implements BaseStore<DailyBalances> {

  readonly basePath = 'daily-business-summary'
}
