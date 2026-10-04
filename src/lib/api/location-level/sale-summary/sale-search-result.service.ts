import {Injectable} from '@angular/core'
import {PaginatedBaseService} from '../../util/paginated-api/paginated-base.service'
import {SaleSearchParameters} from './sale-search-parameters.model'
import {SaleSearchResult} from './sale-search-result.model'
import {SaleSearchResultStore} from './sale-search-result.store'

@Injectable({providedIn: 'root'})
export class SaleSearchResultService extends PaginatedBaseService<SaleSearchResult, SaleSearchParameters> {
  protected override readonly defaultCursor = ''

  constructor(protected override readonly store: SaleSearchResultStore) {
    super(store)
  }
}
