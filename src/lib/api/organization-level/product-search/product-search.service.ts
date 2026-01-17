import {Injectable} from '@angular/core'
import {isEqual} from 'lodash-es'
import {PaginatedBaseService} from '../../util/paginated-api/paginated-base.service'
import {Product} from '../product/product.model'
import {ProductSearchParameters} from './product-search-parameters.model'
import {ProductSearchStore} from './product-search.store'

@Injectable({providedIn: 'root'})
export class ProductSearchService extends PaginatedBaseService<Product, ProductSearchParameters> {
  constructor(protected override readonly store: ProductSearchStore) {
    super(store)
  }

  override parametersHaveChanged(newParams: ProductSearchParameters): boolean {
    const lastParams = this.store.lastSearchParams()
    if (!lastParams) {
      return true
    }
    return !isEqual(lastParams, newParams)
  }
}
