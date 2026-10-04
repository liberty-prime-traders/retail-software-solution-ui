import {Injectable} from '@angular/core'
import {BaseStore, createBaseStore} from '../../util/base-api/base.store'
import {TaxEntrySearchSummary} from './tax-entry-search-summary.model'

@Injectable({providedIn: 'root'})
export class TaxEntrySearchSummaryStore extends createBaseStore<TaxEntrySearchSummary>()
  implements BaseStore<TaxEntrySearchSummary> {

  readonly basePath = 'tax-entries/search/summary'
}
