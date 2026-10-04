import {Injectable} from '@angular/core'
import {PaginatedBaseService} from '../../util/paginated-api/paginated-base.service'
import {TaxEntrySearchParameters} from './tax-entry-search-parameters.model'
import {TaxEntrySearchResult} from './tax-entry-search-result.model'
import {TaxEntrySearchResultStore} from './tax-entry-search-result.store'

@Injectable({providedIn: 'root'})
export class TaxEntrySearchResultService
  extends PaginatedBaseService<TaxEntrySearchResult, TaxEntrySearchParameters> {

  protected override readonly defaultCursor = ''

  constructor(protected override readonly store: TaxEntrySearchResultStore) {
    super(store)
  }
}
