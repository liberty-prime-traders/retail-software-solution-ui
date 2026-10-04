import {Injectable} from '@angular/core'
import {createPaginatedBaseStore, PaginatedBaseStore} from '../../util/paginated-api/paginated-base.store'
import {TaxEntrySearchParameters} from './tax-entry-search-parameters.model'
import {TaxEntrySearchResult} from './tax-entry-search-result.model'

@Injectable({providedIn: 'root'})
export class TaxEntrySearchResultStore
  extends createPaginatedBaseStore<TaxEntrySearchResult, TaxEntrySearchParameters>()
  implements PaginatedBaseStore<TaxEntrySearchResult, TaxEntrySearchParameters> {

  readonly basePath = 'tax-entries'
}
