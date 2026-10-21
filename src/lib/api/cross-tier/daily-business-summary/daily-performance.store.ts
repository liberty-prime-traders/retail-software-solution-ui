import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {DailyPerformance} from './daily-performance.model'

@Injectable({providedIn: 'root'})
export class DailyPerformanceStore
  extends createBaseStore<DailyPerformance>(() => 'daily-performance')
  implements BaseStore<DailyPerformance> {

  readonly basePath = 'daily-business-summary'
}
