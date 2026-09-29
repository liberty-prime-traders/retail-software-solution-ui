import {Injectable} from '@angular/core'
import {PaginatedBaseService} from '../../util/paginated-api/paginated-base.service'
import {PurchaseSearchParameters} from './purchase-search-parameters.model'
import {PurchaseSearchResult} from './purchase-search-result.model'
import {PurchaseSearchResultStore} from './purchase-search-result.store'

@Injectable({providedIn: 'root'})
export class PurchaseSearchResultService extends PaginatedBaseService<PurchaseSearchResult, PurchaseSearchParameters> {
  protected override readonly defaultCursor = ''

  constructor(protected override readonly store: PurchaseSearchResultStore) {
    super(store)
  }
}
