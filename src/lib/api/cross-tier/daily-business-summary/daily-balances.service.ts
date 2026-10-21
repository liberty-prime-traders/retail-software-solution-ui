import {Injectable} from '@angular/core'
import {Subscription} from 'rxjs'
import {BaseService} from '../../util/base-api/base.service'
import {DailyBalances} from './daily-balances.model'
import {DailyBalancesStore} from './daily-balances.store'
import {DailyBusinessSummaryParameters} from './daily-business-summary-parameters.model'

@Injectable({providedIn: 'root'})
export class DailyBalancesService extends BaseService<DailyBalances, DailyBusinessSummaryParameters> {
  constructor(protected override readonly store: DailyBalancesStore) {
    super(store)
  }

  protected override allowMultipleCalls(): boolean {
    return true
  }

  load(parameters: DailyBusinessSummaryParameters): Subscription {
    this.patchApiRequestConfig({urlSuffix: 'balances'})
    return this.post(parameters)
  }
}
