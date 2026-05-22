import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {SaleSessionSummary} from './sale-session-summary.model'

@Injectable({providedIn: 'root'})
export class SaleSessionSummaryStore extends createBaseStore<SaleSessionSummary>()
  implements BaseStore<SaleSessionSummary> {
  readonly basePath = 'sale-sessions'
}
