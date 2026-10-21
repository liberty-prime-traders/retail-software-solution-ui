import {Injectable} from '@angular/core'
import {Subscription} from 'rxjs'
import {BaseService} from '../../util/base-api/base.service'
import {DailyPerformance} from './daily-performance.model'
import {DailyPerformanceStore} from './daily-performance.store'
import {DailyBusinessSummaryParameters} from './daily-business-summary-parameters.model'

@Injectable({providedIn: 'root'})
export class DailyPerformanceService extends BaseService<DailyPerformance, DailyBusinessSummaryParameters> {
  constructor(protected override readonly store: DailyPerformanceStore) {
    super(store)
  }

  protected override allowMultipleCalls(): boolean {
    return true
  }

  load(parameters: DailyBusinessSummaryParameters): Subscription {
    this.patchApiRequestConfig({urlSuffix: 'performance'})
    return this.post(parameters)
  }
}
