import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {SaleSummary} from './sale-summary.model'

@Injectable({providedIn: 'root'})
export class SaleSummaryStore extends createBaseStore<SaleSummary>()
  implements BaseStore<SaleSummary> {
  readonly basePath = 'sales'
}
